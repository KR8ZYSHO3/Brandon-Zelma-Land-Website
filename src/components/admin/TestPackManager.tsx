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

type WalkLink = { label: string; href: string; group: string };

const CUSTOMER_CHECKLIST: {
  step: string;
  what: string;
  href: string;
  expect: string;
}[] = [
  {
    step: "1. Home",
    what: "Landing as a visitor",
    href: "/",
    expect: "Featured [TEST-PACK] listings, Buy + Sell buttons",
  },
  {
    step: "2. Buy — Mission Lab",
    what: "Customer choosing what land is for",
    href: "/find",
    expect: "Four mission chips; save form at bottom",
  },
  {
    step: "3. Hunt matches",
    what: "Mission match pipeline",
    href: "/find?mission=hunt",
    expect: "Hunt Ridge (and timber overlap) cards + buyer form",
  },
  {
    step: "4. Farm matches",
    what: "Farm mission",
    href: "/find?mission=farm",
    expect: "Farm Bench listing card",
  },
  {
    step: "5. Homestead matches",
    what: "Homestead mission",
    href: "/find?mission=homestead",
    expect: "Homestead Hollow listing card",
  },
  {
    step: "6. Timber matches",
    what: "Timber mission",
    href: "/find?mission=timber",
    expect: "Timber Stand listing card",
  },
  {
    step: "7. All listings",
    what: "Browse inventory",
    href: "/listings",
    expect: "All four test tracts listed",
  },
  {
    step: "8. Dossier + inquire",
    what: "Listing detail + buyer form",
    href: "/listings",
    expect: "Open any [TEST-PACK] card → story, notes, Save mission form",
  },
  {
    step: "9. Map",
    what: "Land IQ pins",
    href: "/map",
    expect: "Pins for Meigs, Athens, Vinton, Hocking test tracts",
  },
  {
    step: "10. County pages",
    what: "SEO / local browse",
    href: "/counties/meigs",
    expect: "County blurb + Hunt Ridge card (also try athens, vinton, hocking)",
  },
  {
    step: "11. Sell",
    what: "Seller customer path",
    href: "/sell",
    expect: "Readiness checklist + Request seller strategy form",
  },
  {
    step: "12. Contact",
    what: "General inquiry",
    href: "/contact",
    expect: "Buyer form submits to Leads",
  },
  {
    step: "13. Land Scout AI",
    what: "Chat widget (bottom-right, not on /admin)",
    href: "/",
    expect: "Ask a land question; free advisor answers",
  },
  {
    step: "14. Confirm in admin",
    what: "Any forms you just submitted",
    href: "/admin/leads",
    expect: "New rows appear (plus seeded sample leads)",
  },
];

export function TestPackManager({
  initialCounts,
  walkthrough,
}: {
  initialCounts: Counts;
  walkthrough: WalkLink[];
}) {
  const router = useRouter();
  const [counts, setCounts] = useState(initialCounts);
  const [links, setLinks] = useState(walkthrough);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: "seed" | "purge") {
    if (action === "purge") {
      const ok = confirm(
        "Remove ALL [TEST-PACK] / test pipeline data from public site and admin? Real non-test data stays.",
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
          `Customer inventory ready: ${r.listings} public listings, ${r.buyerLeads + r.sellerLeads} sample leads, market samples. Walk the checklist below (opens public site).`,
        );
      } else {
        const rem = data.result?.removed as Counts | undefined;
        setMsg(
          rem
            ? `Removed from site + admin: ${rem.listings} listings, ${rem.leads} leads, ${rem.comps} comps, ${rem.closedDeals} closed.`
            : "Test pack cleared.",
        );
      }

      const cRes = await fetch("/api/admin/test-pack");
      const cData = await cRes.json();
      if (cData.counts) setCounts(cData.counts as Counts);
      if (cData.walkthrough) setLinks(cData.walkthrough as WalkLink[]);
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  const groups = Array.from(new Set(links.map((l) => l.group)));

  return (
    <div className="space-y-6">
      <div className="surface-elevated p-6">
        <p className="section-kicker">Customer site + admin</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-forest">
          Full pipeline test pack
        </h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Loads fake tracts that show on the{" "}
          <strong className="text-charcoal">public customer site</strong>{" "}
          (home, Mission Lab, listings, map, counties) and sample CRM rows in
          admin. Everything is tagged{" "}
          <code className="text-xs">[TEST-PACK]</code> so you can wipe it clean.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["Public listings", counts.listings],
            ["Sample leads", counts.leads],
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
            {busy ? "Working…" : "Load customer test pack"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void run("purge")}
            className="rounded-full border border-blaze/50 bg-[var(--danger-soft)] px-5 py-2.5 text-sm font-semibold text-blaze disabled:opacity-60"
          >
            Remove all test data
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-forest hover:border-moss"
          >
            Open public home ↗
          </a>
        </div>
        {msg && <p className="mt-3 text-sm text-gold">{msg}</p>}
      </div>

      <div className="surface-card p-5">
        <h3 className="font-display text-lg font-semibold text-forest">
          Customer walkthrough (click each)
        </h3>
        <p className="mt-1 text-sm text-muted">
          Open these as a visitor — not the admin nav. Submit Buy/Sell forms
          with a fake name; then check Admin → Leads.
        </p>
        <ol className="mt-4 space-y-3">
          {CUSTOMER_CHECKLIST.map((c) => (
            <li
              key={c.step}
              className="rounded-xl border border-line bg-limestone/30 px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-forest">{c.step}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-forest underline"
                >
                  Open {c.href === "/" ? "home" : c.href} ↗
                </a>
              </div>
              <p className="mt-1 text-sm text-charcoal">{c.what}</p>
              <p className="mt-1 text-xs text-muted">Expect: {c.expect}</p>
            </li>
          ))}
        </ol>
      </div>

      {links.length > 0 && (
        <div className="surface-card p-5">
          <h3 className="font-display text-lg font-semibold text-forest">
            Live links from current test inventory
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g}>
                <p className="text-xs font-bold uppercase tracking-wider text-moss">
                  {g}
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {links
                    .filter((l) => l.group === g)
                    .map((l) => (
                      <li key={l.href + l.label}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-forest underline-offset-2 hover:underline"
                        >
                          {l.label} ↗
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
