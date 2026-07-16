import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  BUSINESS_PLAN,
  EFFORTLESS_LINKS,
  FINANCIAL_PLAN,
  MISSION_STATEMENT,
} from "@/lib/data/business-plan";

export default async function AdminBusinessPlanPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />

      <p className="section-kicker">Living document</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Mission · Business plan · Financial plan
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Effortless pack for Brandon — copy, act, click links. Not legal/tax advice.
        Pair with{" "}
        <Link href="/admin/business-dev" className="font-semibold text-forest hover:underline">
          VA Path checklist
        </Link>
        .
      </p>

      {/* MISSION */}
      <section className="mt-10 surface-elevated p-6 sm:p-8">
        <p className="section-kicker">Mission statement</p>
        <blockquote className="mt-3 font-display text-2xl font-semibold leading-snug text-forest">
          {MISSION_STATEMENT.short}
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {MISSION_STATEMENT.full}
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {MISSION_STATEMENT.values.map((v) => (
            <li
              key={v}
              className="rounded-xl border border-line bg-limestone/40 px-3 py-2 text-sm text-charcoal"
            >
              {v}
            </li>
          ))}
        </ul>
      </section>

      {/* BUSINESS PLAN */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="section-kicker">Business plan</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-forest">
              {BUSINESS_PLAN.title}
            </h2>
            <p className="text-xs text-muted">{BUSINESS_PLAN.version}</p>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          {BUSINESS_PLAN.summary}
        </p>
        <div className="mt-6 space-y-4">
          {BUSINESS_PLAN.sections.map((s) => (
            <article key={s.id} className="surface-card p-5">
              <h3 className="font-display text-lg font-semibold text-forest">
                {s.title}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {s.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* FINANCIAL */}
      <section className="mt-10">
        <p className="section-kicker">Financial plan</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-forest">
          {FINANCIAL_PLAN.title}
        </h2>
        <p className="mt-2 rounded-xl border border-blaze/30 bg-paper px-4 py-3 text-sm text-muted">
          {FINANCIAL_PLAN.disclaimer}
        </p>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-moss">
          Assumptions (edit to your real split)
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {FINANCIAL_PLAN.assumptions.map((a) => (
            <div key={a.label} className="surface-card p-4">
              <p className="text-xs text-muted">{a.label}</p>
              <p className="font-display text-xl font-semibold text-forest">
                {a.value}
              </p>
              <p className="mt-1 text-xs text-muted">{a.note}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-moss">
          Year targets
        </h3>
        <div className="mt-3 space-y-3">
          {FINANCIAL_PLAN.yearTargets.map((y) => (
            <div key={y.year} className="surface-card p-5">
              <p className="font-display text-lg font-semibold text-forest">
                {y.year}
              </p>
              <p className="mt-1 text-sm">
                <strong>Volume:</strong> {y.sides}
              </p>
              <p className="text-sm">
                <strong>GCI (example):</strong> {y.gciApprox}
              </p>
              <p className="mt-2 text-sm text-muted">{y.focus}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-moss">
          Monthly cost guardrails
        </h3>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-limestone/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {FINANCIAL_PLAN.budgetMonthly.map((b) => (
                <tr key={b.item} className="border-b border-line/70">
                  <td className="px-3 py-2 font-medium">{b.item}</td>
                  <td className="px-3 py-2">{b.amount}</td>
                  <td className="px-3 py-2 text-muted">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
          {FINANCIAL_PLAN.independenceEconomics.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      {/* LINKS */}
      <section className="mt-10">
        <p className="section-kicker">One-click resources</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-forest">
          Effortless links
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {EFFORTLESS_LINKS.map((g) => (
            <div key={g.group} className="surface-card p-5">
              <h3 className="font-semibold text-forest">{g.group}</h3>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-umber hover:text-forest hover:underline"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted">
        Ask Admin AI to “summarize year-1 financial targets” or “draft a mission
        post” →{" "}
        <Link href="/admin/ai" className="text-forest hover:underline">
          AI Copilot
        </Link>
      </p>
    </div>
  );
}
