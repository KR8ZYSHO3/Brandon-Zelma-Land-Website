import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { BIZ_DEV_MILESTONES } from "@/lib/data/biz-dev";

const LABELS: Record<string, string> = {
  va: "VA / VR&E",
  sba: "SBA & mentoring",
  "ohio-license": "Ohio broker license path",
  entity: "Entity & banking",
  operations: "Brokerage operations",
};

export default async function AdminBizDevPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const categories = [
    "va",
    "sba",
    "ohio-license",
    "entity",
    "operations",
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">VA · SBA · Ohio license</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Independence path checklist
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Path to a veteran-owned independent brokerage. VA/SBA help the{" "}
        <em>business</em>; Ohio broker license is the legal gate. Full mission +
        financials:{" "}
        <Link
          href="/admin/business-plan"
          className="font-medium text-forest hover:underline"
        >
          Business Plan
        </Link>
        . VA home loans:{" "}
        <Link href="/admin/va-loans" className="font-medium text-forest hover:underline">
          VA Loans
        </Link>
        .
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/business-plan"
          className="surface-card p-4 transition hover:border-forest"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-moss">
            Step 0
          </p>
          <p className="mt-1 font-semibold text-forest">
            Mission & financial plan
          </p>
          <p className="mt-1 text-xs text-muted">Read once, revisit quarterly</p>
        </Link>
        <a
          href="https://www.va.gov/careers-employment/vocational-rehabilitation/"
          target="_blank"
          rel="noopener noreferrer"
          className="surface-card p-4 transition hover:border-forest"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-moss">
            VA
          </p>
          <p className="mt-1 font-semibold text-forest">Open VR&E portal ↗</p>
          <p className="mt-1 text-xs text-muted">One click · official site</p>
        </a>
        <a
          href="https://www.sba.gov/business-guide/grow-your-business/veteran-owned-businesses"
          target="_blank"
          rel="noopener noreferrer"
          className="surface-card p-4 transition hover:border-forest"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-moss">
            SBA
          </p>
          <p className="mt-1 font-semibold text-forest">Veteran business hub ↗</p>
          <p className="mt-1 text-xs text-muted">Boots to Business entry</p>
        </a>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-blaze/30 bg-paper p-4 text-sm">
        <strong>Remember:</strong> You cannot lawfully practice real estate in
        Ohio without a broker affiliation until <em>you</em> hold a broker
        license and operate a brokerage. This tracker keeps the work visible.
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((cat) => {
          const items = BIZ_DEV_MILESTONES.filter((m) => m.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="font-display text-xl font-semibold text-forest">
                {LABELS[cat]}
              </h2>
              <ul className="mt-3 space-y-3">
                {items.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-line bg-paper p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-charcoal">{m.title}</p>
                      <span className="rounded-full bg-limestone px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-muted">
                        {m.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{m.description}</p>
                    {m.resourceUrl && (
                      <a
                        href={m.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-forest hover:underline"
                      >
                        Open resource →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-12 rounded-2xl border border-line bg-limestone/40 p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          Illustrative split vs own-brokerage math
        </h2>
        <p className="mt-2 text-sm text-muted">
          Example only — your split and deal mix will differ. If average GCI to
          you today is 50% of a 3% side on a $300k sale ≈ $4,500, then 40 sides
          ≈ $180k. Under your own brokerage, keeping more of the fee raises
          margin; hiring agents multiplies volume. Independence is a{" "}
          <strong>margin + team</strong> play, not a magic VA checkbox.
        </p>
      </section>
    </div>
  );
}
