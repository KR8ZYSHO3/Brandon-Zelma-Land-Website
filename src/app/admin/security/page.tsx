import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  ANTI_SCRAPE_REALITY,
  HARDENING_ROADMAP,
  IMPLEMENTED_CONTROLS,
  PRIVACY_CHECKLIST,
  SECURITY_PRINCIPLES,
} from "@/lib/data/security-privacy";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Trust · compliance · abuse resistance</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Security & privacy
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Best practices for this stack. Pair with{" "}
        <Link href="/admin/seo" className="font-semibold text-forest underline">
          SEO crawler settings
        </Link>{" "}
        and Cloudflare Bot Fight Mode on your domain.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {SECURITY_PRINCIPLES.map((p) => (
          <div key={p.title} className="surface-card p-4">
            <p className="font-semibold text-forest">{p.title}</p>
            <p className="mt-1 text-sm text-muted">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-forest">
          What’s in place vs what you enable
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-limestone/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Control</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {IMPLEMENTED_CONTROLS.map((c) => (
                <tr key={c.id} className="border-b border-line/70 align-top">
                  <td className="px-3 py-2 font-medium">{c.label}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        c.status === "live"
                          ? "bg-moss/20 text-forest"
                          : c.status === "ops"
                            ? "bg-umber/15 text-soil"
                            : "bg-blaze/15 text-blaze"
                      }`}
                    >
                      {c.status === "live"
                        ? "Live in app"
                        : c.status === "ops"
                          ? "Your env setup"
                          : "You enable"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted">{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 surface-elevated p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          {ANTI_SCRAPE_REALITY.title}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          {ANTI_SCRAPE_REALITY.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ANTI_SCRAPE_REALITY.layers.map((l) => (
            <div
              key={l.layer}
              className="rounded-xl border border-line bg-limestone/40 px-3 py-2"
            >
              <p className="text-sm font-semibold text-forest">{l.layer}</p>
              <p className="text-xs text-muted">{l.effect}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Privacy checklist
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {PRIVACY_CHECKLIST.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Public page:{" "}
            <a href="/privacy" className="text-forest underline" target="_blank">
              /privacy
            </a>
          </p>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Hardening roadmap
          </h2>
          {HARDENING_ROADMAP.map((h) => (
            <div key={h.when} className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-moss">
                {h.when}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                {h.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
