import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

const bootstrapWorker = async (): Promise<void> => {
  await NestFactory.createApplicationContext(AppModule);
};

const bootstrapApi = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(env.port(), '0.0.0.0');
};

const bootstrap = (): Promise<void> =>
  env.appRole() === 'worker' ? bootstrapWorker() : bootstrapApi();

void bootstrap();
