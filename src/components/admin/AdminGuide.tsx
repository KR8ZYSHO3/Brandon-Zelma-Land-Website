"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MODULES = [
  {
    href: "/admin",
    name: "Command",
    plain: "Home base. Numbers + “what should I do today?” prompts. (This page.)",
    when: "Open this first every day (2 minutes).",
  },
  {
    href: "/admin/leads",
    name: "Leads",
    plain: "Everyone who filled out Buy, Sell, Contact, or listing forms.",
    when: "After any notification — call hot leads same day.",
  },
  {
    href: "/admin/watches",
    name: "Watch Radar",
    plain:
      "Buyer demand by mission × county + which live tracts already fit (Land Fit).",
    when: "When deciding where to list next or who to call first.",
  },
  {
    href: "/admin/listings",
    name: "Listings",
    plain: "Your land book performance (views, CTAs) + launch checklist.",
    when: "When you go live with a new tract or review what’s working.",
  },
  {
    href: "/admin/test-lab",
    name: "Test Lab",
    plain: "Load / remove [TEST-PACK] fake data to walk every pipeline safely.",
    when: "When checking that Buy, Sell, Listings, and Market all work.",
  },
  {
    href: "/admin/service-area",
    name: "Service Area",
    plain: "Turn counties/states on the map ON/OFF — expand past SE Ohio anytime.",
    when: "When you want wider coverage on the public map and buyer forms.",
  },
  {
    href: "/admin/market",
    name: "Market",
    plain: "Comps, demand vs supply, pricing discipline (not an appraisal).",
    when: "Before pricing a listing or advising a seller.",
  },
  {
    href: "/admin/business-plan",
    name: "Business Plan",
    plain:
      "Mission, growth plan, financials, hosting/Cloudflare/domain costs, best stack options.",
    when: "Once thoroughly, then quarterly — or when stuck.",
  },
  {
    href: "/admin/seo",
    name: "SEO / AI SEO",
    plain:
      "Configure titles, AI summary (llms.txt), crawlers, Search Console — classic + ChatGPT SEO.",
    when: "At launch, then monthly content + crawler review.",
  },
  {
    href: "/admin/security",
    name: "Security",
    plain: "Privacy, anti-scrape reality, headers, Cloudflare bots, hardening checklist.",
    when: "At launch and when opening a custom domain.",
  },
  {
    href: "/admin/business-dev",
    name: "VA Path",
    plain: "Checklist to build a veteran-owned company and eventual broker license.",
    when: "When working on independence / grants / SBA (not daily).",
  },
  {
    href: "/admin/va-loans",
    name: "VA Home Loans",
    plain: "How VA loans work so you can help veterans — and grow into homes later.",
    when: "Before talking financing with a veteran buyer.",
  },
  {
    href: "/admin/marketing",
    name: "Marketing",
    plain: "What to do this week and how to scale channels without chaos.",
    when: "Weekly planning (Sunday or Monday).",
  },
  {
    href: "/admin/ai",
    name: "AI Copilot",
    plain: "Free helper: captions, texts, blurbs, plan summaries. Optional Grok later.",
    when: "Anytime you need words fast.",
  },
  {
    href: "/admin/scale",
    name: "Scale",
    plain: "How this platform grows from solo → team → multi-market.",
    when: "When capacity is maxed or you’re hiring help.",
  },
];

export function AdminGuide() {
  const pathname = usePathname() || "";

  return (
    <div className="admin-guide space-y-3">
      <div className="surface-elevated p-5 sm:p-6">
        <p className="section-kicker">Start here · plain English</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-forest">
          How this admin works (don’t panic)
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          There’s a lot on purpose — but you only need{" "}
          <strong className="text-charcoal">three habits</strong>:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-charcoal/95">
          <li>
            <strong>Daily:</strong> Command → Leads (answer people).
          </li>
          <li>
            <strong>Weekly:</strong> Marketing checklist + one seller touch + one
            piece of content.
          </li>
          <li>
            <strong>As needed:</strong> Business Plan / VA Path / VA Loans /
            Market when making bigger decisions.
          </li>
        </ol>
        <p className="mt-3 text-sm text-muted">
          The public site is what clients see.{" "}
          <strong className="text-charcoal">This admin is your cockpit</strong>{" "}
          — CRM, strategy, education, and AI. You do not need to read every page
          every day.
        </p>
      </div>

      <details open>
        <summary>What each tab is for (cheat sheet)</summary>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {MODULES.map((m) => {
            const here =
              m.href === "/admin"
                ? pathname === "/admin"
                : pathname === m.href || pathname.startsWith(`${m.href}/`);
            return (
              <Link
                key={m.href}
                href={m.href}
                onClick={(e) => {
                  if (here) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    e.preventDefault();
                    window.location.assign(m.href);
                  }
                }}
                className={`rounded-xl border p-3 transition hover:border-moss ${
                  here
                    ? "border-moss bg-forest-mid/40 ring-1 ring-moss/40"
                    : "border-line bg-limestone/40"
                }`}
              >
                <p className="text-sm font-semibold text-forest">
                  {m.name}
                  {here ? (
                    <span className="ml-2 text-[11px] font-medium text-gold">
                      · you are here
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {m.plain}
                </p>
                <p className="mt-2 text-[11px] font-medium text-gold">{m.when}</p>
              </Link>
            );
          })}
        </div>
      </details>

      <details>
        <summary>How leads flow (Buy / Sell → you)</summary>
        <div className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
          <p>
            1. Someone uses Mission Lab (buy), Sell, Contact, or a listing form
            on the public site.
          </p>
          <p>
            2. That goes to{" "}
            <strong className="text-charcoal">Admin → Leads</strong> (top nav
            pill labeled Leads — not Command). Each row has name, email, phone,
            type (buyer/seller), score, notes.
          </p>
          <p>
            3. You call/text hot leads same day. Command is only the daily
            overview + this cheat sheet.
          </p>
          <p>
            4. <strong className="text-charcoal">Important on Vercel:</strong>{" "}
            without free Upstash Redis env vars, leads sit in temporary server
            memory and often never show in admin. Open{" "}
            <strong className="text-charcoal">Leads</strong> for the red box
            setup steps, or see DEPLOY.md.
          </p>
        </div>
      </details>

      <details>
        <summary>Public site vs admin (simple map)</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>
            <strong className="text-charcoal">Public:</strong> Home, Buy, Sell,
            Map, Listings, free Land Scout AI for visitors.
          </li>
          <li>
            <strong className="text-charcoal">Admin:</strong> Your private OS —
            money decisions, plan, VA education, marketing, AI drafts.
          </li>
          <li>
            Brokerage name <strong className="text-charcoal">Buckeye Land Sales</strong>{" "}
            must stay on public marketing (Ohio law).
          </li>
        </ul>
      </details>

      <details>
        <summary>AI — free vs optional paid</summary>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Land Scout works with <strong className="text-charcoal">no API key</strong>{" "}
          (built for land + your business). Visitors get the floating button;
          you get Admin → AI Copilot. Later you can add{" "}
          <code className="rounded bg-limestone px-1 text-xs">XAI_API_KEY</code>{" "}
          for Grok if you want smarter drafts — not required.
        </p>
      </details>

      <details>
        <summary>If you only do 10 minutes today</summary>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>Open Leads — reply to anyone new.</li>
          <li>Skim Decision prompts on Command.</li>
          <li>Optional: ask AI to draft one social caption for a listing.</li>
        </ol>
      </details>
    </div>
  );
}
