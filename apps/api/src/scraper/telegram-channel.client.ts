import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface ChannelPost {
  messageId: number;
  text: string;
  photoUrls: string[];
  postedAt: Date;
}

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

@Injectable()
export class TelegramChannelClient {
  private readonly logger = new Logger(TelegramChannelClient.name);

  async fetchPage(channel: string, before?: number): Promise<ChannelPost[]> {
    const base = `https://t.me/s/${channel}`;
    const url = before === undefined ? base : `${base}?before=${before}`;
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!response.ok) {
      this.logger.warn(`Telegram returned ${response.status} for ${url}`);
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return this.parsePage(await response.text());
  }

  private parsePage(html: string): ChannelPost[] {
    const $ = cheerio.load(html);
    const posts: ChannelPost[] = [];
    $('div.tgme_widget_message').each((_, element) => {
      const message = $(element);
      const dataPost = message.attr('data-post');
      if (!dataPost) {
        return;
      }
      const messageId = Number(dataPost.split('/').pop());
      if (!Number.isInteger(messageId)) {
        return;
      }
      const textNode = message.find('.tgme_widget_message_text').first();
      textNode.find('br').replaceWith('\n');
      const text = textNode.text().trim();
      const photoUrls: string[] = [];
      message.find('.tgme_widget_message_photo_wrap').each((__, photo) => {
        const style = $(photo).attr('style') ?? '';
        const match = style.match(/background-image:url\('([^']+)'\)/);
        if (match) {
          photoUrls.push(match[1]);
        }
      });
      const datetime =
        message.find('.tgme_widget_message_date time').attr('datetime') ??
        message.find('time[datetime]').attr('datetime');
      if (!datetime) {
        return;
      }
      posts.push({ messageId, text, photoUrls, postedAt: new Date(datetime) });
    });
    posts.sort((a, b) => a.messageId - b.messageId);
    return this.mergeAlbumParts(posts);
  }

  private mergeAlbumParts(posts: ChannelPost[]): ChannelPost[] {
    const merged: ChannelPost[] = [];
    for (const post of posts) {
      const previous = merged[merged.length - 1];
      const isAlbumContinuation =
        previous !== undefined &&
        post.text.length === 0 &&
        post.photoUrls.length > 0 &&
        previous.text.length > 0 &&
        post.messageId - previous.messageId === 1;
      if (isAlbumContinuation) {
        previous.photoUrls.push(...post.photoUrls);
      } else {
        merged.push(post);
      }
    }
    return merged;
  }
}
