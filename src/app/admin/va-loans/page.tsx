import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { VA_HOME_LOAN_GUIDE } from "@/lib/data/va-home-loans";

export default async function AdminVaLoansPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const g = VA_HOME_LOAN_GUIDE;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Serve veterans · future residential</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        {g.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        {g.purpose}
      </p>
      <p className="mt-3 rounded-xl border border-blaze/30 bg-[var(--danger-soft)] px-4 py-3 text-sm text-muted">
        {g.disclaimer}
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Why this belongs in your business
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {g.whyItMatters.map((w) => (
            <li key={w} className="surface-card p-4 text-sm text-muted">
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Basics in plain English
        </h2>
        <div className="mt-4 space-y-3">
          {g.basics.map((b) => (
            <article key={b.title} className="surface-elevated p-5">
              <h3 className="font-semibold text-forest">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Safe talking points
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {g.talkingPoints.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            This week (effortless)
          </h2>
          <ul className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            {g.weeklyActions.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Path into residential (scalable)
        </h2>
        <ol className="mt-4 space-y-3">
          {g.futureResidentialPath.map((step, i) => (
            <li key={step} className="flex gap-3 surface-card p-4 text-sm">
              <span className="font-display text-lg font-semibold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Scale plays
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {g.scalePlay.map((s) => (
            <li key={s} className="rounded-xl border border-line bg-limestone/40 px-4 py-3 text-sm text-muted">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          Official links (bookmark these)
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {g.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium text-forest transition hover:border-moss"
              >
                {l.label}
                <span className="text-muted">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted">
        Related:{" "}
        <Link href="/admin/business-dev" className="text-forest hover:underline">
          VA business path
        </Link>{" "}
        ·{" "}
        <Link href="/admin/business-plan" className="text-forest hover:underline">
          Business plan
        </Link>{" "}
        ·{" "}
        <Link href="/admin/ai" className="text-forest hover:underline">
          Ask AI: “Explain VA loans vs land financing”
        </Link>
      </p>
    </div>
  );
}
