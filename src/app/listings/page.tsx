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
      {listings.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-paper p-8 text-center text-sm text-muted">
          No active listings right now. Start a{" "}
          <a href="/find" className="font-semibold text-forest hover:underline">
            land mission
          </a>{" "}
          or{" "}
          <a href="/contact" className="font-semibold text-forest hover:underline">
            contact Brandon
          </a>
          .
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
