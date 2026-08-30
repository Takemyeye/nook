import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buildQuery } from "@/lib/api";
import type { ListingsQuery } from "@/lib/types";

function pageHref(query: ListingsQuery, page: number): string {
  return `/${buildQuery({
    district: query.district,
    channel: query.channel,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    rooms: query.rooms,
    search: query.search,
    sort: query.sort,
    page: page > 1 ? String(page) : undefined,
  })}`;
}

function PageLink({
  href,
  disabled,
  children,
  label,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  label: string;
}) {
  const className =
    "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition";
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-not-allowed border-border text-muted-foreground opacity-40`}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${className} border-border bg-card hover:border-primary hover:text-primary`}
    >
      {children}
    </Link>
  );
}

export function Pagination({
  query,
  page,
  totalPages,
}: {
  query: ListingsQuery;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      <PageLink href={pageHref(query, page - 1)} disabled={page <= 1} label="Previous page">
        <ArrowLeft className="size-4" /> Prev
      </PageLink>
      <span className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>
      <PageLink href={pageHref(query, page + 1)} disabled={page >= totalPages} label="Next page">
        Next <ArrowRight className="size-4" />
      </PageLink>
    </nav>
  );
}
