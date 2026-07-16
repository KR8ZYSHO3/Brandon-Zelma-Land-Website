import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  getLeadsStorageLabel,
  leadsAreDurable,
} from "@/lib/leads-store";

const LAYERS = [
  {
    title: "Layer 1 — Solo Land Pro (now)",
    items: [
      "One brand, one county cluster (SE Ohio), one CRM",
      "You + this site + Buckeye compliance",
      "Owned demand: SEO, content, Mission Lab, seller funnel",
      "Free Land Scout AI for leverage on copy and FAQs",
    ],
  },
  {
    title: "Layer 2 — Operator + help",
    items: [
      "Part-time ISA / VA for speed-to-lead",
      "Standard scripts from AI Copilot + Marketing playbook",
      "More listings via seller engine; dual sides",
      "Lender partners for VA / rural home deals",
    ],
  },
  {
    title: "Layer 3 — Team under brand",
    items: [
      "Additional Land Pros share brand + playbooks",
      "Admin roles: ops vs agent (future multi-login)",
      "Shared lead routing rules by county / mission",
      "Still under brokerage until you hold a broker license",
    ],
  },
  {
    title: "Layer 4 — Brokerage / multi-market",
    items: [
      "Ohio broker license + own firm (see VA Path)",
      "Multi-county or multi-state SEO machines",
      "White-label the Land OS stack for your agents",
      "Residential + land product lines; veteran vertical at scale",
    ],
  },
];

export default async function AdminScalePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const durable = leadsAreDurable();
  const storageLabel = getLeadsStorageLabel();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Architecture for growth</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Built to scale massively
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        This is not a brochure site. It’s an operating system: demand → CRM →
        market intel → marketing → education → AI. You scale by adding people
        and markets to the same machine — not by reinventing tools every year.
      </p>

      <section
        className={`mt-8 rounded-2xl border px-5 py-5 ${
          durable
            ? "border-moss/40 bg-limestone/40"
            : "border-blaze/40 bg-[var(--danger-soft)]"
        }`}
      >
        <h2 className="font-display text-lg font-semibold text-forest">
          Keep leads permanently (do this first)
        </h2>
        <p className="mt-1 text-sm text-muted">
          Current storage:{" "}
          <strong className="text-charcoal">{storageLabel}</strong>
        </p>
        {!durable ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-charcoal/90">
            <li>
              Open{" "}
              <a
                href="https://console.upstash.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest underline"
              >
                console.upstash.com
              </a>{" "}
              (free) → Create database → Redis
            </li>
            <li>
              Open the DB → <strong>REST API</strong> tab → copy{" "}
              <code className="text-xs">UPSTASH_REDIS_REST_URL</code> and{" "}
              <code className="text-xs">UPSTASH_REDIS_REST_TOKEN</code>
            </li>
            <li>
              Vercel dashboard → your project →{" "}
              <strong>Settings → Environment Variables</strong> → paste both
              (Production + Preview) → Save
            </li>
            <li>
              Vercel → <strong>Deployments → Redeploy</strong> latest
            </li>
            <li>
              Fill Sell or Buy once → open{" "}
              <Link href="/admin/leads" className="font-semibold text-forest underline">
                Leads
              </Link>
            </li>
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Buy/Sell forms write here permanently. Open{" "}
            <Link href="/admin/leads" className="font-semibold text-forest underline">
              Leads
            </Link>{" "}
            after each form fill.
          </p>
        )}
      </section>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Product", "Missions, dossiers, map, AI, seller funnel"],
          ["Data", "Leads, comps, KPIs, tags (vet, VA, county)"],
          ["Playbooks", "Marketing, VA loans, business plan, scripts"],
        ].map(([k, v]) => (
          <div key={k} className="surface-card p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-moss">
              {k}
            </p>
            <p className="mt-1 text-sm text-muted">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        {LAYERS.map((layer) => (
          <section key={layer.title} className="surface-elevated p-6">
            <h2 className="font-display text-lg font-semibold text-forest">
              {layer.title}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {layer.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 surface-card p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          Technical scalability (for your builder)
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>
            Leads: Upstash Redis now (env vars); later Supabase/Postgres for
            multi-agent CRM
          </li>
          <li>Multi-tenant agents: role column + RLS on leads/listings</li>
          <li>County SEO pages are template-driven — add states as data</li>
          <li>AI route already mode-split (public vs admin)</li>
          <li>Deploy on Vercel; CDN static assets; edge-friendly pages</li>
          <li>Separate brand domains later; one codebase</li>
        </ul>
      </section>

      <section className="mt-8 surface-card p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          Revenue scalability
        </h2>
        <p className="mt-2 text-sm text-muted">
          Solo GCI has a ceiling. Seven figures usually means{" "}
          <strong className="text-charcoal">inventory + team + margin</strong>{" "}
          (own brokerage). Land + rural residential + veteran niche compounds.
          See{" "}
          <Link href="/admin/business-plan" className="text-forest hover:underline">
            financial plan
          </Link>{" "}
          and{" "}
          <Link href="/admin/va-loans" className="text-forest hover:underline">
            VA home loans
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
