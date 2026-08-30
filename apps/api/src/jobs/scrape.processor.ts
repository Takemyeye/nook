import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScrapeService } from '../scraper/scrape.service';
import { SCRAPE_QUEUE, ScrapeChannelJobData } from './queues';

@Processor(SCRAPE_QUEUE, { concurrency: 1 })
export class ScrapeProcessor extends WorkerHost {
  private readonly logger = new Logger(ScrapeProcessor.name);

  constructor(private readonly scrapeService: ScrapeService) {
    super();
  }

  async process(job: Job<ScrapeChannelJobData>): Promise<void> {
    const { channel } = job.data;
    this.logger.log(`Scraping channel ${channel}`);
    const result = await this.scrapeService.scrapeChannel(channel);
    this.logger.log(`Channel ${channel} done: created ${result.created}, skipped ${result.skipped}`);
  }
}
