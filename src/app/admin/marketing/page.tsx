import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { MARKETING_PLAYBOOK } from "@/lib/data/business-plan";

export default async function AdminMarketingPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Growth engine</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Marketing playbook
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Lean, ruthless priorities for SE Ohio land. Owned demand first; paid
        only after tracking. Use AI Copilot for captions and lead replies.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="surface-card p-5 border-l-4 border-l-forest">
          <h2 className="font-display text-lg font-semibold text-forest">
            This week (non-negotiables)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Contact every hot lead same day</li>
            <li>One seller conversation or FSBO/sphere touch</li>
            <li>One piece of content (walk clip or Field Note stub)</li>
            <li>Update pipeline stages in Leads</li>
          </ol>
        </div>
        <div className="surface-card p-5 border-l-4 border-l-gold">
          <h2 className="font-display text-lg font-semibold text-forest">
            Metrics that matter
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Seller leads / week</li>
            <li>Buyer missions saved</li>
            <li>Listing appointments set</li>
            <li>Cost per appointment (when ads run)</li>
            <li>Email list growth</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {MARKETING_PLAYBOOK.map((block) => (
          <section key={block.phase} className="surface-elevated p-6">
            <h2 className="font-display text-xl font-semibold text-forest">
              {block.phase}
            </h2>
            <ul className="mt-3 space-y-2">
              {block.tactics.map((t) => (
                <li
                  key={t}
                  className="flex gap-2 text-sm text-charcoal/90"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-10 surface-card p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          Channel stack (lean)
        </h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-forest">Owned</p>
            <p className="mt-1 text-muted">
              This site, Mission Lab, email list, YouTube, SEO counties
            </p>
          </div>
          <div>
            <p className="font-semibold text-forest">Earned</p>
            <p className="mt-1 text-muted">
              Referrals, partners, veterans groups, 4-H/FFA network
            </p>
          </div>
          <div>
            <p className="font-semibold text-forest">Paid (later)</p>
            <p className="mt-1 text-muted">
              Meta/Google to seller + buyer magnets after analytics prove flow
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm">
          Draft creative in{" "}
          <Link href="/admin/ai" className="font-semibold text-forest hover:underline">
            AI Copilot
          </Link>{" "}
          · watch demand gaps in{" "}
          <Link href="/admin/market" className="font-semibold text-forest hover:underline">
            Market
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
