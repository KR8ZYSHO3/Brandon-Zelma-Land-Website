"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Counts = {
  listings: number;
  leads: number;
  comps: number;
  closedDeals: number;
};

export function TestPackManager({ initialCounts }: { initialCounts: Counts }) {
  const router = useRouter();
  const [counts, setCounts] = useState(initialCounts);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: "seed" | "purge") {
    if (action === "purge") {
      const ok = confirm(
        "Remove ALL data tagged [TEST-PACK]? Real leads/listings without that tag stay.",
      );
      if (!ok) return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/test-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      if (action === "seed") {
        const r = data.result as {
          listings: number;
          buyerLeads: number;
          sellerLeads: number;
          comps: number;
          closedDeals: number;
        };
        setMsg(
          `Loaded test pack: ${r.listings} listings, ${r.buyerLeads} buyers, ${r.sellerLeads} sellers, ${r.comps} comps, ${r.closedDeals} closed.`,
        );
      } else {
        const rem = data.result?.removed as Counts | undefined;
        setMsg(
          rem
            ? `Removed: ${rem.listings} listings, ${rem.leads} leads, ${rem.comps} comps, ${rem.closedDeals} closed deals.`
            : "Test pack cleared.",
        );
      }

      const cRes = await fetch("/api/admin/test-pack");
      const cData = await cRes.json();
      if (cData.counts) setCounts(cData.counts as Counts);
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-elevated p-6">
        <p className="section-kicker">Pipeline QA</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-forest">
          Test pack controls
        </h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          One click loads fake buy/sell leads, listings, comps, and a closed
          deal — all tagged <code className="text-xs">[TEST-PACK]</code>. Use{" "}
          <strong className="text-charcoal">Remove test pack</strong> when done
          (or delete rows individually in Leads / Listings / Market).
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["Listings", counts.listings],
            ["Leads", counts.leads],
            ["Comps", counts.comps],
            ["Closed", counts.closedDeals],
          ].map(([label, n]) => (
            <div
              key={String(label)}
              className="rounded-xl border border-line bg-limestone/40 px-3 py-2 text-center"
            >
              <p className="text-xs uppercase tracking-wider text-muted">
                {label}
              </p>
              <p className="font-display text-2xl font-semibold text-forest">
                {n}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void run("seed")}
            className="rounded-full btn-action px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Working…" : "Load test pack"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run("purge")}
            className="rounded-full border border-blaze/50 bg-[var(--danger-soft)] px-5 py-2.5 text-sm font-semibold text-blaze disabled:opacity-60"
          >
            Remove test pack
          </button>
        </div>
        {msg && <p className="mt-3 text-sm text-gold">{msg}</p>}
      </div>

      <div className="surface-card p-5">
        <h3 className="font-display text-lg font-semibold text-forest">
          What the pack tests
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            <Link href="/admin/leads" className="font-semibold text-forest underline">
              Leads
            </Link>{" "}
            — 3 buyers + 2 sellers (hot/warm/cool scores)
          </li>
          <li>
            <Link
              href="/admin/listings"
              className="font-semibold text-forest underline"
            >
              Listings
            </Link>{" "}
            — 2 active tracts (Meigs hunt + Athens homestead)
          </li>
          <li>
            Public{" "}
            <Link href="/listings" className="font-semibold text-forest underline">
              /listings
            </Link>
            , dossiers,{" "}
            <Link
              href="/find?mission=hunt"
              className="font-semibold text-forest underline"
            >
              Mission Lab
            </Link>
            , map pins
          </li>
          <li>
            <Link href="/admin/market" className="font-semibold text-forest underline">
              Market
            </Link>{" "}
            — 2 comps + 1 closed deal for KPIs
          </li>
          <li>
            <Link href="/admin" className="font-semibold text-forest underline">
              Command
            </Link>{" "}
            — totals, sources, demand vs inventory
          </li>
        </ol>
      </div>
    </div>
  );
}
