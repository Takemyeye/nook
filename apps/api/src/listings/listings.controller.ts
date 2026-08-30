import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListingsQueryDto } from './dto/listings-query.dto';
import { ListingDto } from './listing.mapper';
import { ChannelCount, DistrictCount, ListingsPage, ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findMany(@Query() query: ListingsQueryDto): Promise<ListingsPage> {
    return this.listingsService.findMany(query);
  }

  @Get('districts')
  async findDistricts(): Promise<{ districts: DistrictCount[] }> {
    return { districts: await this.listingsService.findDistricts() };
  }

  @Get('channels')
  async findChannels(): Promise<{ channels: ChannelCount[] }> {
    return { channels: await this.listingsService.findChannels() };
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ListingDto> {
    return this.listingsService.findOne(id);
  }
}
