const required = (name: string): string => {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
};

export const env = {
  appRole: (): string => process.env.APP_ROLE ?? 'api',
  port: (): number => Number(process.env.PORT ?? 4000),
  redisHost: (): string => required('REDIS_HOST'),
  redisPort: (): number => Number(process.env.REDIS_PORT ?? 6379),
  s3Endpoint: (): string => required('S3_ENDPOINT'),
  s3Region: (): string => required('S3_REGION'),
  s3AccessKey: (): string => required('S3_ACCESS_KEY'),
  s3SecretKey: (): string => required('S3_SECRET_KEY'),
  s3Bucket: (): string => required('S3_BUCKET'),
  s3PublicUrl: (): string => required('S3_PUBLIC_URL').replace(/\/$/, ''),
  channels: (): string[] =>
    (process.env.CHANNELS ?? '')
      .split(',')
      .map((channel) => channel.trim())
      .filter((channel) => channel.length > 0),
  lookbackDays: (): number => Number(process.env.LOOKBACK_DAYS ?? 7),
};
