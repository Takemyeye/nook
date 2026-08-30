import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { env } from '../config/env';
import { ScraperModule } from '../scraper/scraper.module';
import { SCRAPE_QUEUE } from './queues';
import { ScrapeProcessor } from './scrape.processor';
import { ScrapeScheduler } from './scrape.scheduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: env.redisHost(),
        port: env.redisPort(),
      },
    }),
    BullModule.registerQueue({ name: SCRAPE_QUEUE }),
    ScraperModule,
  ],
  providers: [ScrapeScheduler, ScrapeProcessor],
})
export class JobsModule {}
