import type { Listing } from "@/lib/types";
import { ListingCard } from "./listing-card";

export function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
