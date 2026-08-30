import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { env } from '../config/env';
import { SCRAPE_CHANNEL_JOB, SCRAPE_QUEUE, ScrapeChannelJobData } from './queues';

@Injectable()
export class ScrapeScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(ScrapeScheduler.name);

  constructor(@InjectQueue(SCRAPE_QUEUE) private readonly queue: Queue<ScrapeChannelJobData>) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.enqueueAll();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyRun(): Promise<void> {
    await this.enqueueAll();
  }

  private async enqueueAll(): Promise<void> {
    const channels = env.channels();
    for (const channel of channels) {
      await this.queue.add(
        SCRAPE_CHANNEL_JOB,
        { channel },
        { jobId: channel, removeOnComplete: true, removeOnFail: true },
      );
    }
    this.logger.log(`Enqueued scrape jobs for ${channels.length} channels`);
  }
}
