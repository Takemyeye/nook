import Link from "next/link";
import { Home } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
        <Home className="size-5" />
      </span>
      <div>
        <p className="font-medium">No listings here yet.</p>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Try loosening the filters — or, if this is a fresh setup, the worker may still be
          fetching its first batch of listings from Telegram.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg text-sm font-medium text-primary underline-offset-4 transition hover:underline hover:brightness-110"
      >
        Clear all filters
      </Link>
    </div>
  );
}
