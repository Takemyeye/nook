import { Module } from '@nestjs/common';
import { env } from './config/env';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { ListingsModule } from './listings/listings.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    ListingsModule,
    ...(env.appRole() === 'worker' ? [JobsModule] : []),
  ],
})
export class AppModule {}
