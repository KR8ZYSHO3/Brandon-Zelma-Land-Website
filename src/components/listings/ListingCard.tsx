import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice, pricePerAcre } from "@/lib/format";
import { MISSIONS } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex flex-col overflow-hidden surface-elevated transition duration-300 hover:-translate-y-1"
    >
      <div className="relative flex h-48 items-end overflow-hidden bg-forest p-5">
        <div className="absolute inset-0 hero-glow opacity-90" />
        <div className="absolute inset-0 dossier-grid opacity-40" />
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {listing.county} County · {listing.acres}± ac
          </p>
          <p className="mt-1 font-display text-3xl font-semibold text-charcoal">
            {formatPrice(listing.price)}
          </p>
        </div>
        {listing.status === "pending" && (
          <span className="absolute right-3 top-3 rounded-full bg-blaze px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Pending
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold text-charcoal transition group-hover:text-forest">
          {listing.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {listing.story}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {listing.missions.map((m) => {
            const meta = MISSIONS.find((x) => x.id === m);
            return (
              <span
                key={m}
                className="rounded-full bg-limestone px-2.5 py-0.5 text-[11px] font-semibold text-forest"
              >
                {meta?.short ?? m}
              </span>
            );
          })}
          <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted">
            {formatPrice(pricePerAcre(listing))}/ac
          </span>
        </div>
      </div>
    </Link>
  );
}
