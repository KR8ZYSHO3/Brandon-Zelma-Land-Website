import type { Metadata } from "next";
import Link from "next/link";
import { getActiveMarkets } from "@/lib/markets-store";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Land buying guides and county notes from Brandon Zelma Land.",
};

export const dynamic = "force-dynamic";

const NOTES = [
  {
    slug: "how-to-buy-land-ohio",
    title: "How to buy land in Ohio without getting burned",
    excerpt:
      "Access, surveys, perc, flood, timber rights, and what “± acres” really means.",
  },
  {
    slug: "hunting-land-checklist",
    title: "Hunting land scorecard for SE Ohio",
    excerpt:
      "Cover, food, water, pressure, and whether the tract can actually hold deer.",
  },
  {
    slug: "what-land-is-worth",
    title: "What your land is worth: 7 factors beyond acre price",
    excerpt:
      "Road frontage, shape, timber, utilities, and buyer missions that move price.",
  },
];

export default async function FieldNotesPage() {
  const counties = await getActiveMarkets();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Field Notes
      </h1>
      <p className="mt-3 text-muted">
        Education engine + county guides. Active counties follow Admin → Service
        Area (expand anytime).
      </p>

      <div className="mt-10 space-y-4">
        {NOTES.map((n) => (
          <article
            key={n.slug}
            className="rounded-2xl border border-line bg-paper p-5"
          >
            <h2 className="font-display text-xl font-semibold text-forest">
              {n.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{n.excerpt}</p>
            <p className="mt-2 text-xs text-moss">Coming as full article soon</p>
          </article>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-forest">
        Active market guides
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {counties.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/counties/${c.slug}`}
              className="text-sm font-medium text-forest hover:underline"
            >
              Land for sale in {c.name}
              {c.state && c.state !== "OH" ? `, ${c.state}` : ""} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
