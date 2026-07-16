import type { Metadata } from "next";
import Link from "next/link";
import { getActiveListings, formatPrice } from "@/lib/data/listings";
import { FOCUS_COUNTIES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Land IQ Map",
  description:
    "Map-first browse of Southeast Ohio land listings with Brandon Zelma Land.",
};

export default function MapPage() {
  const listings = getActiveListings().filter((l) => l.status === "active");

  // Simple projected positions for demo map (not cartographically perfect)
  const lats = listings.map((l) => l.lat);
  const lngs = listings.map((l) => l.lng);
  const minLat = Math.min(...lats, 38.9);
  const maxLat = Math.max(...lats, 39.8);
  const minLng = Math.min(...lngs, -83.3);
  const maxLng = Math.max(...lngs, -81.7);

  function pos(lat: number, lng: number) {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat || 1)) * 100;
    return { left: `${Math.min(95, Math.max(5, x))}%`, top: `${Math.min(90, Math.max(8, y))}%` };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Land IQ
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Map-first discovery for SE Ohio. v1 uses a lightweight regional canvas
        (no paid Mapbox bill). Pins link to full field dossiers. Deeper soil /
        flood layers can layer in when revenue pays for data.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="relative col-span-2 min-h-[420px] overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-moss/40 via-limestone to-soil/20 shadow-inner">
          <div className="absolute inset-0 dossier-grid opacity-40" />
          <p className="absolute left-4 top-4 z-10 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-forest shadow">
            SE Ohio focus region
          </p>
          {FOCUS_COUNTIES.map((c) => {
            const p = pos(c.lat, c.lng);
            return (
              <Link
                key={c.slug}
                href={`/counties/${c.slug}`}
                className="absolute z-[5] -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-forest/70 hover:text-forest"
                style={p}
              >
                {c.name.replace(" County", "")}
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
          <div className="rounded-xl border border-dashed border-line p-4 text-xs text-muted">
            Layer toggles (terrain, soils, flood) ship as data budget allows.
            Decision-grade intel also lives in Admin → Market.
          </div>
        </div>
      </div>
    </div>
  );
}
