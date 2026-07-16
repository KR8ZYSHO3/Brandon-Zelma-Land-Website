import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { getDashboardStats } from "@/lib/analytics";
import { CLOSED_DEALS, MARKET_COMPS, USDA_CONTEXT } from "@/lib/data/market";
import { formatPrice } from "@/lib/data/listings";

export default async function AdminMarketPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const s = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">
        Market intelligence
      </h1>
      <p className="mt-1 text-sm text-muted">
        Decision support only — not an appraisal. SE recreational land often
        diverges from statewide cropland indexes.
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
          <p className="font-display text-2xl font-semibold">
            {MARKET_COMPS.length}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Comps journal
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-limestone/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">County</th>
                <th className="px-3 py-2">Acres</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">$/ac</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_COMPS.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-muted">
                    No comps yet — log sales as you learn the market.
                  </td>
                </tr>
              )}
              {MARKET_COMPS.map((c) => (
                <tr key={c.id} className="border-b border-line/70">
                  <td className="px-3 py-2">{c.county}</td>
                  <td className="px-3 py-2">{c.acres}</td>
                  <td className="px-3 py-2">{formatPrice(c.price)}</td>
                  <td className="px-3 py-2">{formatPrice(c.pricePerAcre)}</td>
                  <td className="px-3 py-2">{c.saleDate}</td>
                  <td className="px-3 py-2">{c.landType}</td>
                  <td className="px-3 py-2 text-xs text-muted">{c.sourceNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Your closed book
        </h2>
        <ul className="mt-3 space-y-2">
          {CLOSED_DEALS.length === 0 && (
            <li className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-muted">
              No closed deals logged yet.
            </li>
          )}
          {CLOSED_DEALS.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-sm"
            >
              <span className="font-medium">
                {d.county} · {d.acres} ac · {formatPrice(d.price)}
              </span>
              <span className="text-muted">
                {" "}
                ({formatPrice(d.pricePerAcre)}/ac) · {d.side} · {d.closedAt}
              </span>
            </li>
          ))}
        </ul>
      </section>

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
          Counties where buyer demand exceeds your active supply.
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
              No positive gaps yet — collect more county-tagged buyer missions.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
