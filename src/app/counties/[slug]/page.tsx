import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import { getListingsByCounty } from "@/lib/listings-store";
import { getActiveMarkets, getServiceArea } from "@/lib/markets-store";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MARKET_CATALOG } from "@/lib/data/default-markets";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return MARKET_CATALOG.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = await getServiceArea();
  const county =
    area.markets.find((c) => c.slug === slug) ||
    MARKET_CATALOG.find((c) => c.slug === slug);
  if (!county) return { title: "County" };
  return {
    title: `Land for Sale in ${county.name}`,
    description: `${county.blurb} Work with Brandon Zelma, Buckeye Land Sales.`,
  };
}

export default async function CountyPage({ params }: Props) {
  const { slug } = await params;
  const area = await getServiceArea();
  const county =
    area.markets.find((c) => c.slug === slug) ||
    MARKET_CATALOG.find((c) => c.slug === slug);
  if (!county) notFound();

  const active = await getActiveMarkets();
  const isActive = active.some((m) => m.slug === slug);
  const nameShort = county.name.replace(" County", "");
  const listings = await getListingsByCounty(nameShort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Land for sale in {county.name}
        {county.state ? `, ${county.state}` : ""}
      </h1>
      <p className="mt-3 max-w-2xl text-muted leading-relaxed">{county.blurb}</p>
      <p className="mt-2 text-sm text-muted">
        Guided by Brandon Zelma · <strong>Buckeye Land Sales</strong>
        {!isActive && (
          <span className="block mt-1 text-xs text-gold">
            This market is in the catalog but currently off in Service Area
            settings.
          </span>
        )}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/find">Start a land mission</ButtonLink>
        <ButtonLink href="/sell" variant="secondary">
          Sell {nameShort} land
        </ButtonLink>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-forest">
        Current listings
      </h2>
      {listings.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          No active listings tagged to this county right now — save a mission or
          seller lead and Brandon will prospect.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
