import type { Listing } from "@/lib/types";

/** Live listing book — empty until Brandon / admin adds real properties. */
export const LISTINGS: Listing[] = [];

export function getActiveListings(): Listing[] {
  return LISTINGS.filter((l) => l.status === "active" || l.status === "pending");
}

export function getListingBySlug(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

export function getListingsByCounty(countyName: string): Listing[] {
  return getActiveListings().filter(
    (l) => l.county.toLowerCase() === countyName.toLowerCase(),
  );
}

export function getListingsByMission(mission: string): Listing[] {
  return getActiveListings().filter((l) =>
    l.missions.includes(mission as Listing["missions"][number]),
  );
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pricePerAcre(listing: Listing): number {
  return listing.acres > 0 ? listing.price / listing.acres : 0;
}
