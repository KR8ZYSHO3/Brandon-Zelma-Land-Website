import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { MarketBookManager } from "@/components/admin/MarketBookManager";
import { getDashboardStats } from "@/lib/analytics";
import { readClosedDeals, readComps } from "@/lib/market-book-store";
import { formatPrice } from "@/lib/listings-store";
import { USDA_CONTEXT } from "@/lib/data/market";

export default async function AdminMarketPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const s = await getDashboardStats();
  const comps = await readComps();
  const closed = await readClosedDeals();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">
        Market intelligence
      </h1>
      <p className="mt-1 text-sm text-muted">
        Decision support from <strong className="text-charcoal">your</strong>{" "}
        comps and closed book — not seed data. Not an appraisal.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-moss">
            Book avg $/ac
          </p>
          <p className="font-display text-2xl font-semibold">
            {formatPrice(s.avgPricePerAcreBook)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-moss">
            Closed avg $/ac
          </p>
          <p className="font-display text-2xl font-semibold">
            {formatPrice(s.avgClosedPpa)}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-wider text-moss">
            Comps logged
          </p>
          <p className="font-display text-2xl font-semibold">{comps.length}</p>
        </div>
      </div>

      <div className="mt-10">
        <MarketBookManager initialComps={comps} initialClosed={closed} />
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-limestone/40 p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          {USDA_CONTEXT.title}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {USDA_CONTEXT.source} · as of {USDA_CONTEXT.asOf}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {USDA_CONTEXT.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <a
          href="https://quickstats.nass.usda.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-semibold text-forest hover:underline"
        >
          USDA NASS Quick Stats →
        </a>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Where to prospect
        </h2>
        <p className="mt-1 text-sm text-muted">
          From live lead demand vs your live listings.
        </p>
        <ul className="mt-3 space-y-1 text-sm">
          {s.demandSupplyGaps
            .filter((g) => g.gap > 0)
            .map((g) => (
              <li
                key={g.county}
                className="rounded-lg border border-line bg-paper px-3 py-2"
              >
                <strong>{g.county}</strong> — {g.demand} interested buyers,{" "}
                {g.supply} active listings (gap {g.gap})
              </li>
            ))}
          {s.demandSupplyGaps.filter((g) => g.gap > 0).length === 0 && (
            <li className="text-muted">
              No demand gaps yet — collect county-tagged buyer missions.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
