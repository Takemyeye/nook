import { Listing, ListingImage } from '@prisma/client';
import { env } from '../config/env';

export interface ListingDto {
  id: string;
  channel: string;
  sourceUrl: string;
  title: string;
  description: string;
  price: number | null;
  currency: string | null;
  rooms: number | null;
  bedrooms: number | null;
  area: number | null;
  district: string | null;
  postedAt: string;
  imageUrls: string[];
}

export type ListingWithImages = Listing & { images: ListingImage[] };

export const toListingDto = (listing: ListingWithImages): ListingDto => ({
  id: listing.id,
  channel: listing.channel,
  sourceUrl: listing.sourceUrl,
  title: listing.title,
  description: listing.description,
  price: listing.price,
  currency: listing.currency,
  rooms: listing.rooms,
  bedrooms: listing.bedrooms,
  area: listing.area,
  district: listing.district,
  postedAt: listing.postedAt.toISOString(),
  imageUrls: [...listing.images]
    .sort((a, b) => a.position - b.position)
    .map((image) => `${env.s3PublicUrl()}/${image.key}`),
});
