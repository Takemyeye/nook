import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from './config/env';
import { PrismaModule } from './prisma/prisma.module';
import { ScrapeService } from './scraper/scrape.service';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [PrismaModule, ScraperModule],
})
class ScrapeCliModule {}

const run = async (): Promise<void> => {
  const daysArg = process.argv[2];
  if (daysArg !== undefined) {
    const days = Number(daysArg);
    if (!Number.isInteger(days) || days < 1) {
      console.error(`Invalid days value: ${daysArg}. Usage: node dist/scrape-cli.js [days]`);
      process.exit(1);
    }
    process.env.LOOKBACK_DAYS = String(days);
  }

  const app = await NestFactory.createApplicationContext(ScrapeCliModule, { logger: ['log', 'warn', 'error'] });
  const scrapeService = app.get(ScrapeService);
  console.log(`Scraping ${env.channels().length} channels, lookback ${env.lookbackDays()} days`);
  for (const channel of env.channels()) {
    const result = await scrapeService.scrapeChannel(channel);
    console.log(`${channel}: created ${result.created}, skipped ${result.skipped}`);
  }
  await app.close();
};

void run();
