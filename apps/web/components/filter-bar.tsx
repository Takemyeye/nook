import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/select";
import type { ListingsQuery } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none";

function channelHandle(channel: string): string {
  return channel.startsWith("@") ? channel : `@${channel}`;
}

export function FilterBar({
  query,
  channels,
}: {
  query: ListingsQuery;
  channels: { name: string; count: number }[];
}) {
  return (
    <form
      method="GET"
      action="/"
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_.6fr_.6fr_.7fr_1fr_.9fr_auto]"
    >
      {query.district && <input type="hidden" name="district" value={query.district} />}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          name="search"
          defaultValue={query.search}
          placeholder="Search listings…"
          aria-label="Search listings"
          className={`${inputClass} pl-10`}
        />
      </div>
      <input
        type="number"
        name="minPrice"
        min={0}
        defaultValue={query.minPrice}
        placeholder="Min price"
        aria-label="Minimum price"
        className={inputClass}
      />
      <input
        type="number"
        name="maxPrice"
        min={0}
        defaultValue={query.maxPrice}
        placeholder="Max price"
        aria-label="Maximum price"
        className={inputClass}
      />
      <Select
        name="rooms"
        label="Number of rooms"
        defaultValue={query.rooms ?? ""}
        options={[
          { value: "", label: "Any rooms" },
          { value: "1", label: "1 room" },
          { value: "2", label: "2 rooms" },
          { value: "3", label: "3 rooms" },
          { value: "4", label: "4+ rooms" },
        ]}
      />
      <Select
        name="channel"
        label="Telegram channel"
        defaultValue={query.channel ?? ""}
        options={[
          { value: "", label: "All channels" },
          ...channels.map((channel) => ({
            value: channel.name,
            label: `${channelHandle(channel.name)} · ${channel.count}`,
          })),
        ]}
      />
      <Select
        name="sort"
        label="Sort order"
        defaultValue={query.sort ?? "newest"}
        options={[
          { value: "newest", label: "Newest first" },
          { value: "priceAsc", label: "Price: low to high" },
          { value: "priceDesc", label: "Price: high to low" },
        ]}
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        <SlidersHorizontal className="size-4" />
        Apply
      </button>
    </form>
  );
}
