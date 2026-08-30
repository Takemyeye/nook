import type { Currency } from "./types";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  GEL: "₾",
};

export function formatPrice(price: number | null, currency: Currency | null): string {
  if (price === null) return "Price on request";
  const symbol = currency ? currencySymbols[currency] : "";
  return `${symbol}${price.toLocaleString("en-US")}`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function plural(count: number, singular: string, pluralForm?: string): string {
  const word = count === 1 ? singular : (pluralForm ?? `${singular}s`);
  return `${count} ${word}`;
}
