import { Search, SlidersHorizontal } from "lucide-react";
import type { ListingsQuery } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none";

export function FilterBar({ query }: { query: ListingsQuery }) {
  return (
    <form
      method="GET"
      action="/"
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.7fr_.8fr_.9fr_auto]"
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
      <select
        name="rooms"
        defaultValue={query.rooms ?? ""}
        aria-label="Number of rooms"
        className={inputClass}
      >
        <option value="">Any rooms</option>
        <option value="1">1 room</option>
        <option value="2">2 rooms</option>
        <option value="3">3 rooms</option>
        <option value="4">4+ rooms</option>
      </select>
      <select
        name="sort"
        defaultValue={query.sort ?? "newest"}
        aria-label="Sort order"
        className={inputClass}
      >
        <option value="newest">Newest first</option>
        <option value="priceAsc">Price: low to high</option>
        <option value="priceDesc">Price: high to low</option>
      </select>
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
