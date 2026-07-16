import type { Listing } from "@/lib/types";

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pricePerAcre(listing: Pick<Listing, "price" | "acres">): number {
  return listing.acres > 0 ? listing.price / listing.acres : 0;
}
