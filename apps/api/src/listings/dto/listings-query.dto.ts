import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export const LISTING_SORTS = ['newest', 'priceAsc', 'priceDesc'] as const;

export type ListingSort = (typeof LISTING_SORTS)[number];

export const MAX_ROOMS_FILTER = 4;

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 48;

export class ListingsQueryDto {
  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_ROOMS_FILTER)
  rooms?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsIn(LISTING_SORTS)
  sort: ListingSort = 'newest';
}
