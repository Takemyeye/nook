import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { ScrapeService } from './scrape.service';
import { TelegramChannelClient } from './telegram-channel.client';

@Module({
  imports: [StorageModule],
  providers: [ScrapeService, TelegramChannelClient],
  exports: [ScrapeService],
})
export class ScraperModule {}
