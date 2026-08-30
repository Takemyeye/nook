import { BedDouble, DoorOpen, Ruler } from "lucide-react";
import { plural } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function SpecBadges({ listing }: { listing: Listing }) {
  const specs = [
    listing.rooms !== null && { icon: DoorOpen, label: plural(listing.rooms, "room") },
    listing.bedrooms !== null && { icon: BedDouble, label: plural(listing.bedrooms, "bedroom") },
    listing.area !== null && { icon: Ruler, label: `${listing.area} m²` },
  ].filter((spec) => spec !== false);

  if (specs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {specs.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground"
        >
          <Icon className="size-3.5 text-primary" />
          {label}
        </span>
      ))}
    </div>
  );
}
