import { DistrictChips } from "@/components/district-chips";
import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { ListingGrid } from "@/components/listing-grid";
import { Pagination } from "@/components/pagination";
import { getChannels, getDistricts, getListings } from "@/lib/api";
import { plural } from "@/lib/format";
import type { ListingsQuery } from "@/lib/types";

export const dynamic = "force-dynamic";

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query: ListingsQuery = {
    district: firstValue(params.district),
    channel: firstValue(params.channel),
    minPrice: firstValue(params.minPrice),
    maxPrice: firstValue(params.maxPrice),
    rooms: firstValue(params.rooms),
    search: firstValue(params.search),
    page: firstValue(params.page),
    sort: firstValue(params.sort),
  };

  const [listings, { districts }, { channels }] = await Promise.all([
    getListings(query),
    getDistricts(),
    getChannels(),
  ]);
  const totalPages = Math.max(1, Math.ceil(listings.total / listings.pageSize));

  return (
    <main className="relative">
      <Hero />
      <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Explore the city
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A district for every mood.
          </h2>
        </div>
        <DistrictChips districts={districts} query={query} />
        <div className="mt-6">
          <FilterBar query={query} channels={channels} />
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{plural(listings.total, "listing")}</span>{" "}
          {query.district ? `in ${query.district}` : "across Tbilisi"}
        </p>
        <div className="mt-5">
          {listings.items.length > 0 ? <ListingGrid listings={listings.items} /> : <EmptyState />}
        </div>
        <Pagination query={query} page={listings.page} totalPages={totalPages} />
      </section>
    </main>
  );
}
