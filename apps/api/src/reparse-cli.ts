import { PrismaClient } from '@prisma/client';
import {
  parseArea,
  parseBedrooms,
  parseDistrict,
  parsePrice,
  parseRooms,
  parseTitle,
} from './scraper/listing-parser';

const prisma = new PrismaClient();

const run = async (): Promise<void> => {
  const listings = await prisma.listing.findMany({
    select: { id: true, description: true },
  });
  let updated = 0;
  for (const listing of listings) {
    const { price, currency } = parsePrice(listing.description);
    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        title: parseTitle(listing.description),
        price,
        currency,
        rooms: parseRooms(listing.description),
        bedrooms: parseBedrooms(listing.description),
        area: parseArea(listing.description),
        district: parseDistrict(listing.description),
      },
    });
    updated++;
  }
  console.log(`Reparsed ${updated} listings`);
};

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
