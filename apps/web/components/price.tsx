import { formatPrice } from "@/lib/format";
import type { Currency } from "@/lib/types";

export function Price({
  price,
  currency,
  size = "md",
}: {
  price: number | null;
  currency: Currency | null;
  size?: "md" | "lg";
}) {
  const text = formatPrice(price, currency);
  if (price === null) {
    return (
      <span className={size === "lg" ? "text-xl font-medium text-muted-foreground" : "text-sm font-medium text-muted-foreground"}>
        {text}
      </span>
    );
  }
  return (
    <span>
      <strong className={size === "lg" ? "text-3xl font-semibold tracking-tight" : "text-lg tracking-tight"}>
        {text}
      </strong>
      <small className="text-muted-foreground"> / month</small>
    </span>
  );
}
