import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { env } from '../config/env';

@Injectable()
export class S3Service {
  private client?: S3Client;

  private getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        endpoint: env.s3Endpoint(),
        region: env.s3Region(),
        credentials: {
          accessKeyId: env.s3AccessKey(),
          secretAccessKey: env.s3SecretKey(),
        },
        forcePathStyle: true,
      });
    }
    return this.client;
  }

  async uploadFromUrl(url: string, key: string): Promise<void> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Image fetch failed with status ${response.status}`);
    }
    const body = Buffer.from(await response.arrayBuffer());
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: env.s3Bucket(),
        Key: key,
        Body: body,
        ContentType: response.headers.get('content-type') ?? 'image/jpeg',
      }),
    );
  }
}
