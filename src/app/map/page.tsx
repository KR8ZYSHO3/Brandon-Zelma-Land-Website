import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getActiveListings, formatPrice } from "@/lib/listings-store";
import { getActiveMarkets, getServiceArea } from "@/lib/markets-store";

export const metadata: Metadata = {
  title: "Land IQ Map",
  description:
    "Map-first browse of land listings — coverage set by Brandon’s active service area.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MapPage() {
  noStore();
  const listings = (await getActiveListings()).filter(
    (l) => l.status === "active",
  );
  const markets = await getActiveMarkets();
  const area = await getServiceArea();

  const lats = [
    ...listings.map((l) => l.lat),
    ...markets.map((m) => m.lat),
  ];
  const lngs = [
    ...listings.map((l) => l.lng),
    ...markets.map((m) => m.lng),
  ];

  const pad = 0.35;
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;

  function pos(lat: number, lng: number) {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat || 1)) * 100;
    return {
      left: `${Math.min(95, Math.max(5, x))}%`,
      top: `${Math.min(90, Math.max(8, y))}%`,
    };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Land IQ
      </h1>
      <p className="mt-2 text-sm font-semibold text-forest">
        {area.regionLabel}
        <span className="ml-2 font-normal text-muted">
          · {markets.length} markets on
        </span>
      </p>
      <p className="mt-2 max-w-2xl text-muted">{area.regionBlurb}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="relative col-span-2 min-h-[420px] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-moss/40 via-limestone to-soil/20 shadow-inner">
          <div className="absolute inset-0 dossier-grid opacity-40" />
          <p className="absolute left-4 top-4 z-10 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-forest shadow">
            {area.regionLabel}
          </p>
          <p className="absolute bottom-4 left-4 z-10 max-w-[70%] rounded-lg bg-paper/90 px-2 py-1 text-[10px] text-muted">
            {markets.length} markets · {listings.length} active listings · expands
            from Admin → Service Area
          </p>
          {markets.map((c) => {
            const p = pos(c.lat, c.lng);
            return (
              <Link
                key={c.slug}
                href={`/counties/${c.slug}`}
                className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-forest/80 hover:text-forest"
                style={p}
                title={`${c.name}, ${c.state}`}
              >
                {c.name.replace(" County", "")}
                {c.state !== "OH" ? ` (${c.state})` : ""}
              </Link>
            );
          })}
          {listings.map((l) => {
            const p = pos(l.lat, l.lng);
            return (
              <Link
                key={l.id}
                href={`/listings/${l.slug}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={p}
                title={l.title}
              >
                <span className="map-pin block" />
                <span className="mt-1 block max-w-[120px] truncate rounded bg-paper/95 px-1.5 py-0.5 text-[10px] font-semibold text-charcoal shadow">
                  {l.acres}ac · {formatPrice(l.price)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-forest">
            Active pins
          </h2>
          {listings.length === 0 && (
            <p className="text-sm text-muted">No active listings in the book yet.</p>
          )}
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/listings/${l.slug}`}
              className="block rounded-xl border border-line bg-paper p-3 transition hover:border-forest"
            >
              <p className="text-sm font-semibold text-charcoal">{l.title}</p>
              <p className="text-xs text-muted">
                {l.county} · {l.acres}± ac · {formatPrice(l.price)}
              </p>
            </Link>
          ))}

          <h2 className="mt-6 font-display text-lg font-semibold text-forest">
            Coverage markets
          </h2>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-muted">
            {markets.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/counties/${m.slug}`}
                  className="hover:text-forest"
                >
                  {m.name}, {m.state}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
