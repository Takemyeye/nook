import Link from "next/link";
import { buildQuery } from "@/lib/api";
import type { ListingsQuery } from "@/lib/types";

function chipHref(query: ListingsQuery, district?: string): string {
  return `/${buildQuery({
    district,
    channel: query.channel,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    rooms: query.rooms,
    search: query.search,
    sort: query.sort,
  })}`;
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm transition ${
        active
          ? "border-primary bg-primary font-medium text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

export function DistrictChips({
  districts,
  query,
}: {
  districts: { name: string; count: number }[];
  query: ListingsQuery;
}) {
  if (districts.length === 0) return null;
  return (
    <div className="scrollbar-none -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
      <Chip href={chipHref(query)} active={!query.district} label="All districts" />
      {districts.map((district) => (
        <Chip
          key={district.name}
          href={chipHref(query, district.name)}
          active={query.district === district.name}
          label={`${district.name} · ${district.count}`}
        />
      ))}
    </div>
  );
}
