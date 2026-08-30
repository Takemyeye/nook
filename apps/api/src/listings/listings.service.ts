import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListingsQueryDto, ListingSort, MAX_ROOMS_FILTER } from './dto/listings-query.dto';
import { ListingDto, toListingDto } from './listing.mapper';

export interface ListingsPage {
  items: ListingDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DistrictCount {
  name: string;
  count: number;
}

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: ListingsQueryDto): Promise<ListingsPage> {
    const where = this.buildWhere(query);
    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy: this.buildOrderBy(query.sort),
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { images: true },
      }),
      this.prisma.listing.count({ where }),
    ]);
    return {
      items: items.map(toListingDto),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findDistricts(): Promise<DistrictCount[]> {
    const groups = await this.prisma.listing.groupBy({
      by: ['district'],
      where: { district: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { district: 'desc' } },
    });
    return groups
      .filter((group): group is typeof group & { district: string } => group.district !== null)
      .map((group) => ({ name: group.district, count: group._count._all }));
  }

  async findOne(id: string): Promise<ListingDto> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return toListingDto(listing);
  }

  private buildWhere(query: ListingsQueryDto): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};
    if (query.district) {
      where.district = query.district;
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      };
    }
    if (query.rooms !== undefined) {
      where.rooms =
        query.rooms >= MAX_ROOMS_FILTER ? { gte: MAX_ROOMS_FILTER } : query.rooms;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private buildOrderBy(sort: ListingSort): Prisma.ListingOrderByWithRelationInput[] {
    if (sort === 'priceAsc') {
      return [{ price: { sort: 'asc', nulls: 'last' } }, { postedAt: 'desc' }];
    }
    if (sort === 'priceDesc') {
      return [{ price: { sort: 'desc', nulls: 'last' } }, { postedAt: 'desc' }];
    }
    return [{ postedAt: 'desc' }];
  }
}
