import type { Metadata } from "next";
import { ListingCard } from "@/components/listings/ListingCard";
import { getActiveListings } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "Land for Sale",
  description:
    "Southeast Ohio land listings with field-report dossiers from Brandon Zelma, Buckeye Land Sales.",
};

export default function ListingsPage() {
  const listings = getActiveListings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Land for sale
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Every tract gets a dossier: story, access, soils notes, wildlife, and
        Brandon&apos;s walk notes. Prices and availability change — confirm
        details before you drive.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
