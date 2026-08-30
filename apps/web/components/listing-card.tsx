import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";
import { formatDate, plural } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { ChannelBadge } from "./channel-badge";
import { Price } from "./price";

function specLine(listing: Listing): string {
  const parts = [
    listing.rooms !== null ? plural(listing.rooms, "room") : null,
    listing.bedrooms !== null ? plural(listing.bedrooms, "bed") : null,
    listing.area !== null ? `${listing.area} m²` : null,
  ].filter((part) => part !== null);
  return parts.join(" · ");
}

export function ListingCard({ listing }: { listing: Listing }) {
  const specs = specLine(listing);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)] has-[a:focus-visible]:border-primary has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring/60">
      <Link
        href={`/listings/${listing.id}`}
        className="block focus-visible:outline-none"
        aria-label={`${listing.title} — view listing`}
      >
        <div className="relative aspect-[1.3] w-full overflow-hidden bg-card">
          {listing.imageUrls[0] ? (
            <img
              src={listing.imageUrls[0]}
              alt={listing.title}
              loading="lazy"
              className="size-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid size-full place-items-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
          <div className="absolute left-4 top-4">
            <ChannelBadge channel={listing.channel} />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div>
            <h3 className="line-clamp-2 font-medium tracking-tight">{listing.title}</h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              {listing.district ? `${listing.district}, Tbilisi` : "Tbilisi"}
              <time dateTime={listing.postedAt} className="ml-auto shrink-0 text-xs">
                {formatDate(listing.postedAt)}
              </time>
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="truncate text-xs text-muted-foreground">{specs}</span>
            <Price price={listing.price} currency={listing.currency} />
          </div>
        </div>
      </Link>
    </article>
  );
}
