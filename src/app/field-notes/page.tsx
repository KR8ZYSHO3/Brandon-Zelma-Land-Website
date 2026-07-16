import type { Metadata } from "next";
import Link from "next/link";
import { getActiveMarkets } from "@/lib/markets-store";

export const metadata: Metadata = {
  title: "Field Notes",
  description: "County guides for Brandon Zelma Land active markets.",
};

export const dynamic = "force-dynamic";

export default async function FieldNotesPage() {
  const counties = await getActiveMarkets();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Field Notes
      </h1>
      <p className="mt-3 text-muted">
        County guides for markets currently ON in Brandon&apos;s service area.
        Educational articles can be added as real content is written.
      </p>

      <h2 className="mt-12 font-display text-2xl font-semibold text-forest">
        Active market guides
      </h2>
      {counties.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          No markets active yet. Brandon sets coverage in Admin → Service Area.
        </p>
      ) : (
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
      )}
    </div>
  );
}
