import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../storage/s3.service';
import { contentHash } from './content-hash';
import {
  isNoisePost,
  isSalePost,
  parseArea,
  parseBedrooms,
  parseDistrict,
  parsePrice,
  parseRooms,
  parseTitle,
} from './listing-parser';
import { ChannelPost, TelegramChannelClient } from './telegram-channel.client';

export interface ScrapeResult {
  created: number;
  skipped: number;
}

const SAFETY_MAX_PAGES = 2000;
const PROGRESS_EVERY_PAGES = 20;
const MAX_PHOTOS = 8;
const MIN_TEXT_LENGTH = 40;
const PAGE_DELAY_MS = 700;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const UNIQUE_CONSTRAINT_ERROR = 'P2002';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const lookbackCutoff = (): Date => new Date(Date.now() - env.lookbackDays() * MS_PER_DAY);

@Injectable()
export class ScrapeService {
  private readonly logger = new Logger(ScrapeService.name);

  constructor(
    private readonly client: TelegramChannelClient,
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async scrapeChannel(channel: string): Promise<ScrapeResult> {
    const cutoff = lookbackCutoff();
    const result: ScrapeResult = { created: 0, skipped: 0 };
    let before: number | undefined;

    for (let page = 0; page < SAFETY_MAX_PAGES; page++) {
      const posts = await this.client.fetchPage(channel, before);
      if (posts.length === 0) {
        break;
      }
      for (const post of posts) {
        if (post.postedAt < cutoff) {
          continue;
        }
        try {
          const created = await this.handlePost(channel, post);
          if (created) {
            result.created++;
          } else {
            result.skipped++;
          }
        } catch (error) {
          result.skipped++;
          this.logger.warn(`Failed post ${channel}/${post.messageId}: ${String(error)}`);
        }
      }
      const oldest = posts[0];
      if (oldest.postedAt < cutoff) {
        break;
      }
      if (before !== undefined && oldest.messageId >= before) {
        this.logger.warn(`Pagination stalled for ${channel} at message ${before}`);
        break;
      }
      if ((page + 1) % PROGRESS_EVERY_PAGES === 0) {
        this.logger.log(
          `${channel}: page ${page + 1}, reached ${oldest.postedAt.toISOString().slice(0, 16)}, created ${result.created}, skipped ${result.skipped}`,
        );
      }
      before = oldest.messageId;
      await delay(PAGE_DELAY_MS);
    }

    return result;
  }

  private async handlePost(channel: string, post: ChannelPost): Promise<boolean> {
    if (post.text.length < MIN_TEXT_LENGTH || post.photoUrls.length === 0) {
      return false;
    }
    if (isSalePost(post.text)) {
      return false;
    }
    const { price, currency } = parsePrice(post.text);
    if (isNoisePost(post.text, price)) {
      return false;
    }
    const hash = contentHash(post.text);
    if (await this.isDuplicate(channel, post.messageId, hash)) {
      return false;
    }

    const uploadedKeys = await this.uploadPhotos(channel, post);
    if (uploadedKeys.length === 0) {
      return false;
    }
    try {
      await this.prisma.listing.create({
        data: {
          channel,
          messageId: post.messageId,
          contentHash: hash,
          sourceUrl: `https://t.me/${channel}/${post.messageId}`,
          title: parseTitle(post.text),
          description: post.text,
          price,
          currency,
          rooms: parseRooms(post.text),
          bedrooms: parseBedrooms(post.text),
          area: parseArea(post.text),
          district: parseDistrict(post.text),
          postedAt: post.postedAt,
          images: {
            create: uploadedKeys.map((key, position) => ({ key, position })),
          },
        },
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return false;
      }
      throw error;
    }
    return true;
  }

  private async isDuplicate(channel: string, messageId: number, hash: string): Promise<boolean> {
    const existing = await this.prisma.listing.findFirst({
      where: {
        OR: [{ channel, messageId }, { contentHash: hash }],
      },
      select: { id: true },
    });
    return existing !== null;
  }

  private async uploadPhotos(channel: string, post: ChannelPost): Promise<string[]> {
    const keys: string[] = [];
    const photoUrls = post.photoUrls.slice(0, MAX_PHOTOS);
    for (let index = 0; index < photoUrls.length; index++) {
      const key = `listings/${channel}/${post.messageId}/${index}.jpg`;
      try {
        await this.s3.uploadFromUrl(photoUrls[index], key);
        keys.push(key);
      } catch (error) {
        this.logger.warn(`Image upload failed for ${channel}/${post.messageId}: ${String(error)}`);
      }
    }
    return keys;
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_ERROR
    );
  }
}
