import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  getWatchDemand,
  matchListingsForWatch,
  readWatches,
} from "@/lib/watch-store";
import { formatPrice } from "@/lib/format";
import { MISSIONS } from "@/lib/types";
import { WatchDeleteButton } from "@/components/admin/WatchDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminWatchesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const watches = await readWatches();
  const demand = await getWatchDemand();
  const active = watches.filter((w) => w.active);

  const rows = await Promise.all(
    active.slice(0, 40).map(async (w) => {
      const matches = await matchListingsForWatch(w);
      return { w, matches };
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Buyer demand OS</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Watch Radar
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Consumers activate a watch from{" "}
        <Link href="/find" className="text-forest underline">
          Mission Lab
        </Link>
        . You see where demand clusters and which live tracts already fit.
      </p>
      <p className="mt-2 text-sm font-semibold text-forest">
        {active.length} active watches · {demand.length} demand cells
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-forest">
          List here next (demand heat)
        </h2>
        <p className="mt-1 text-xs text-muted">
          Mission × county from Watch Radar — inventory gaps are money.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-limestone/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Mission</th>
                <th className="px-3 py-2">County</th>
                <th className="px-3 py-2">Watchers</th>
                <th className="px-3 py-2">Avg max $</th>
                <th className="px-3 py-2">Avg min ac</th>
              </tr>
            </thead>
            <tbody>
              {demand.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted">
                    No watches yet — share /find Watch Radar with buyers.
                  </td>
                </tr>
              )}
              {demand.map((d) => (
                <tr key={d.key} className="border-b border-line/70">
                  <td className="px-3 py-2 capitalize font-medium">
                    {MISSIONS.find((m) => m.id === d.mission)?.label ||
                      d.mission}
                  </td>
                  <td className="px-3 py-2">{d.county}</td>
                  <td className="px-3 py-2 font-semibold text-forest">
                    {d.watchers}
                  </td>
                  <td className="px-3 py-2">
                    {d.avgBudget != null ? formatPrice(d.avgBudget) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {d.avgAcresMin != null ? `${d.avgAcresMin}+` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Active watches
        </h2>
        <div className="mt-4 space-y-3">
          {rows.length === 0 && (
            <p className="text-sm text-muted">No active watches.</p>
          )}
          {rows.map(({ w, matches }) => (
            <div
              key={w.id}
              className="rounded-2xl border border-line bg-paper p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-charcoal">{w.name}</p>
                  <p className="text-xs text-muted">
                    {w.email}
                    {w.phone ? ` · ${w.phone}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-forest">
                    {MISSIONS.find((m) => m.id === w.mission)?.label} ·{" "}
                    {w.counties.length ? w.counties.join(", ") : "any county"}
                    {w.budgetMax != null
                      ? ` · max ${formatPrice(w.budgetMax)}`
                      : ""}
                    {w.acresMin != null ? ` · ${w.acresMin}+ ac` : ""}
                  </p>
                  {w.notes && (
                    <p className="mt-1 text-xs text-muted">{w.notes}</p>
                  )}
                </div>
                <WatchDeleteButton id={w.id} />
              </div>
              {matches.length > 0 ? (
                <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs">
                  <li className="font-semibold text-moss">
                    Live fits (score ≥ 55)
                  </li>
                  {matches.map((m) => (
                    <li key={m.listing.id}>
                      <Link
                        href={`/listings/${m.listing.slug}?mission=${w.mission}`}
                        className="text-forest underline"
                      >
                        Fit {m.score} · {m.listing.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
                  No strong live fit — prospect inventory for this watch.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
