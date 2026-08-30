import { cache } from "react";
import { notFound } from "next/navigation";
import type { DistrictsResponse, Listing, ListingsQuery, ListingsResponse } from "./types";

const PAGE_SIZE = 12;

function apiUrl(): string {
  return process.env.API_URL ?? "http://localhost:4000";
}

export function buildQuery(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`API request failed: ${response.status} ${path}`);
  return response.json() as Promise<T>;
}

export async function getListings(query: ListingsQuery): Promise<ListingsResponse> {
  return fetchJson<ListingsResponse>(
    `/listings${buildQuery({
      district: query.district,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      rooms: query.rooms,
      search: query.search,
      page: query.page,
      pageSize: String(PAGE_SIZE),
      sort: query.sort,
    })}`,
  );
}

export async function getDistricts(): Promise<DistrictsResponse> {
  try {
    return await fetchJson<DistrictsResponse>("/listings/districts");
  } catch {
    return { districts: [] };
  }
}

export const getListing = cache(async (id: string): Promise<Listing> => {
  return fetchJson<Listing>(`/listings/${encodeURIComponent(id)}`);
});
