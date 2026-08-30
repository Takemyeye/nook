# nook

Tbilisi rental listings aggregator. A worker scrapes public Telegram channels (via t.me/s), deduplicates listings by content hash, stores images in S3 (MinIO), and a web UI browses them through the API.

## Architecture

```
web (Next.js :3000) ──> api (NestJS :4000) ──> postgres
worker ──> BullMQ (redis) ──> t.me/s scraping ──> S3 (minio)
```

The worker runs an hourly cron that enqueues scrape jobs for each configured channel, parses posts from the last `LOOKBACK_DAYS` days, dedupes by content hash, uploads photos to MinIO, and writes listings to Postgres.

## Quick start

```
docker compose up --build -d
```

Or `make up` / `make down` / `make logs` / `make ps`.

## URLs

- Web: http://localhost:3000
- API: http://localhost:4000/listings
- MinIO console: http://localhost:9001 (minioadmin / minioadmin)

## Configuration

Set in `docker-compose.yml` for api and worker:

- `CHANNELS` — comma-separated public Telegram channel names to scrape
- `LOOKBACK_DAYS` — how far back to parse posts (default 7)

## Notes

First listings appear a couple of minutes after the worker starts (initial scrape plus image uploads).
