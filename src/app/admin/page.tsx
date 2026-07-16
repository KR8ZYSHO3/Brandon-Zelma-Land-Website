import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/analytics";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminGuide } from "@/components/admin/AdminGuide";
import { formatPrice } from "@/lib/data/listings";
import { MISSION_STATEMENT } from "@/lib/data/business-plan";
import { leadsAreDurable, getLeadsStorageLabel } from "@/lib/leads-store";
import { getWatchDemand, readWatches } from "@/lib/watch-store";
import { MISSIONS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const s = await getDashboardStats();
  const durable = leadsAreDurable();
  const storageLabel = getLeadsStorageLabel();
  const watches = (await readWatches()).filter((w) => w.active);
  const watchDemand = (await getWatchDemand()).slice(0, 6);

  const cards = [
    { label: "Total leads", value: String(s.totalLeads), tip: "All form fills ever" },
    { label: "This week", value: String(s.leadsThisWeek), tip: "New interest last 7 days" },
    { label: "Hot leads", value: String(s.hotLeads), tip: "Call these first" },
    {
      label: "Watch Radar",
      value: String(watches.length),
      tip: "Buyers waiting on mission fits",
    },
    {
      label: "Buyers / Sellers",
      value: `${s.buyerLeads} / ${s.sellerLeads}`,
      tip: "Sellers = future inventory",
    },
    {
      label: "Active listings",
      value: String(s.activeListings),
      tip: "Properties currently live",
    },
    {
      label: "Pipeline value",
      value: formatPrice(s.pipelineValue),
      tip: "Sum of active list prices",
    },
    {
      label: "Book avg $/ac",
      value: formatPrice(s.avgPricePerAcreBook),
      tip: "Your actives only",
    },
    {
      label: "Closed volume",
      value: formatPrice(s.closedVolume),
      tip: "From closed deals you log",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Daily home</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
            Command center
          </h1>
          <p className="mt-2 max-w-xl text-sm italic text-muted">
            “{MISSION_STATEMENT.short}”
          </p>
        </div>
        <p className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-muted">
          Tip: read the guide below once, then ignore it until you need it
        </p>
      </div>

      {!durable && (
        <div className="mt-6 rounded-2xl border border-blaze/40 bg-[var(--danger-soft)] px-4 py-4 text-sm">
          <p className="font-semibold text-blaze">
            Buy/Sell form answers are not sticking in admin yet
          </p>
          <p className="mt-1 text-muted">
            Storage: {storageLabel}. Forms succeed for the customer, but admin
            often can’t see them until free Redis is connected.{" "}
            <Link
              href="/admin/leads"
              className="font-semibold text-forest underline"
            >
              Open Leads
            </Link>{" "}
            or{" "}
            <Link
              href="/admin/scale"
              className="font-semibold text-forest underline"
            >
              Scale → Keep leads permanently
            </Link>
            .
          </p>
        </div>
      )}

      {/* HOW IT WORKS — first so Brandon isn't dumped into data */}
      <div className="mt-8">
        <AdminGuide />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {[
          ["/admin/leads", "Leads first"],
          ["/admin/watches", "Watch Radar demand"],
          ["/admin/service-area", "Expand map area"],
          ["/admin/marketing", "This week’s marketing"],
          ["/admin/ai", "Draft with AI"],
          ["/admin/va-loans", "VA home loans"],
          ["/admin/business-plan", "Business plan"],
          ["/admin/scale", "How we scale"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full btn-action px-3 py-1.5 text-xs font-semibold"
          >
            {label}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-forest">
            Snapshot
          </h2>
          <p className="text-xs text-muted">Hover labels · plain meaning under each</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="surface-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-moss">
                {c.label}
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-charcoal">
                {c.value}
              </p>
              <p className="mt-1 text-[11px] text-muted">{c.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          What to do next
        </h2>
        <p className="mt-1 text-xs text-muted">
          Auto suggestions from your lead + listing data — not magic, just math.
        </p>
        <ul className="mt-3 space-y-2">
          {s.decisionPrompts.map((p) => (
            <li
              key={p}
              className="rounded-xl border border-blaze/25 bg-[var(--danger-soft)] px-4 py-3 text-sm text-charcoal"
            >
              → {p}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Where leads come from
          </h2>
          <p className="text-xs text-muted">So you know what marketing works</p>
          <ul className="mt-3 space-y-1 text-sm">
            {s.sourceBreakdown.length === 0 && (
              <li className="text-muted">
                No leads yet — share Mission Lab or Sell links.
              </li>
            )}
            {s.sourceBreakdown.map((x) => (
              <li
                key={x.source}
                className="flex justify-between rounded-lg border border-line bg-limestone/30 px-3 py-2"
              >
                <span>{x.source}</span>
                <span className="font-semibold">{x.count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Watch Radar demand
          </h2>
          <p className="text-xs text-muted">
            Mission × county from Buyer Watch —{" "}
            <Link href="/admin/watches" className="text-forest underline">
              full board
            </Link>
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {watchDemand.length === 0 && (
              <li className="text-muted">
                No watches yet — share Mission Lab Watch Radar.
              </li>
            )}
            {watchDemand.map((d) => (
              <li
                key={d.key}
                className="flex justify-between rounded-lg border border-line bg-limestone/30 px-3 py-2"
              >
                <span>
                  {MISSIONS.find((m) => m.id === d.mission)?.short || d.mission}{" "}
                  · {d.county}
                </span>
                <span className="font-semibold text-forest">
                  {d.watchers} watching
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Demand vs your inventory
          </h2>
          <p className="text-xs text-muted">
            High demand + no listing = go prospect that county
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {s.demandSupplyGaps.length === 0 && (
              <li className="text-muted">Need buyer leads with counties.</li>
            )}
            {s.demandSupplyGaps.slice(0, 8).map((g) => (
              <li
                key={g.county}
                className="flex justify-between rounded-lg border border-line bg-limestone/30 px-3 py-2"
              >
                <span>{g.county}</span>
                <span className="text-muted">
                  want {g.demand} · have {g.supply}{" "}
                  <span className={g.gap > 0 ? "font-semibold text-blaze" : ""}>
                    (gap {g.gap})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Missions people pick
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {s.missionDemand.map((m) => (
              <li
                key={m.mission}
                className="flex justify-between rounded-lg border border-line bg-limestone/30 px-3 py-2"
              >
                <span className="capitalize">{m.mission}</span>
                <span className="font-semibold">{m.count}</span>
              </li>
            ))}
            {s.missionDemand.length === 0 && (
              <li className="text-muted">No mission-tagged buyers yet.</li>
            )}
          </ul>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Listing performance
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {s.listingPerformance.slice(0, 6).map((l) => (
              <li
                key={l.slug}
                className="rounded-lg border border-line bg-limestone/30 px-3 py-2"
              >
                <p className="font-medium line-clamp-1">{l.title}</p>
                <p className="text-xs text-muted">
                  {l.views} views · {l.ctaClicks} CTAs ·{" "}
                  {(l.conversion * 100).toFixed(1)}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
