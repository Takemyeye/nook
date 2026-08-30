export type Currency = "USD" | "GEL";

export type Listing = {
  id: string;
  channel: string;
  sourceUrl: string;
  title: string;
  description: string;
  price: number | null;
  currency: Currency | null;
  rooms: number | null;
  bedrooms: number | null;
  area: number | null;
  district: string | null;
  postedAt: string;
  imageUrls: string[];
};

export type ListingsResponse = {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
};

export type DistrictsResponse = {
  districts: { name: string; count: number }[];
};

export type SortOption = "newest" | "priceAsc" | "priceDesc";

export type ListingsQuery = {
  district?: string;
  minPrice?: string;
  maxPrice?: string;
  rooms?: string;
  search?: string;
  page?: string;
  sort?: string;
};
