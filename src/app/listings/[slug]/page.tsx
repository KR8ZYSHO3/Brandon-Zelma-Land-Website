import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LeadForm } from "@/components/forms/LeadForm";
import {
  formatPrice,
  getListingBySlug,
  pricePerAcre,
  readListings,
} from "@/lib/listings-store";
import { MISSIONS } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const listings = await readListings();
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Listing" };
  return {
    title: listing.title,
    description: listing.story.slice(0, 155),
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/listings"
        className="text-sm font-medium text-forest hover:underline"
      >
        ← All listings
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-paper shadow-sm">
        <div className="relative hero-glow px-6 py-14 sm:px-10">
          <div className="absolute inset-0 opacity-20 dossier-grid" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">
              Field dossier · {listing.county} County · {listing.acres}± acres
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold text-charcoal sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-4 font-display text-3xl text-forest">
              {formatPrice(listing.price)}
              <span className="ml-3 text-lg text-muted">
                {formatPrice(pricePerAcre(listing))}/ac
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {listing.missions.map((m) => {
                const meta = MISSIONS.find((x) => x.id === m);
                return (
                  <span
                    key={m}
                    className="rounded-full bg-limestone px-3 py-1 text-xs font-medium text-forest"
                  >
                    {meta?.label ?? m}
                  </span>
                );
              })}
              {listing.status === "pending" && (
                <span className="rounded-full bg-blaze px-3 py-1 text-xs font-bold text-charcoal">
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <h2 className="font-display text-xl font-semibold text-forest">
                The story
              </h2>
              <p className="mt-3 leading-relaxed text-charcoal/90">
                {listing.story || "Details coming from Brandon’s walk notes."}
              </p>
            </section>

            {listing.brandonNotes && (
              <section className="rounded-2xl border border-line bg-limestone/40 p-5">
                <h2 className="font-display text-xl font-semibold text-forest">
                  Brandon&apos;s walk notes
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal/90">
                  {listing.brandonNotes}
                </p>
              </section>
            )}

            <section className="grid gap-4 sm:grid-cols-2">
              {[
                ["Access", listing.accessNotes],
                ["Utilities", listing.utilities],
                ["Soils", listing.soilsSummary],
                ["Flood / water", listing.floodNote],
                ["Wildlife / recreation", listing.wildlifeNotes],
                ["Location note", listing.addressDisplay],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    key={label as string}
                    className="rounded-xl border border-line bg-limestone/50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-moss">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-charcoal">{value}</p>
                  </div>
                ))}
            </section>

            {listing.features.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-semibold text-forest">
                  Features
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {listing.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-charcoal"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-limestone p-5">
              <p className="text-sm font-semibold text-forest">
                Interested in this tract?
              </p>
              <p className="mt-1 text-xs text-muted">
                Brandon Zelma · Buckeye Land Sales · (740) 438-3658
              </p>
            </div>
            <LeadForm
              type="buyer"
              source={`listing:${listing.slug}`}
              defaultMission={listing.missions[0]}
              extraPayload={{ listingSlug: listing.slug }}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
