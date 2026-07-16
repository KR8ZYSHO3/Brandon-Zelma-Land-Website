import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getLeadsStorageLabel,
  getLeadsStorageMode,
  leadsAreDurable,
  readLeads,
} from "@/lib/leads-store";
import { AdminNav } from "@/components/admin/AdminNav";
import { scoreLabel } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const leads = await readLeads();
  const durable = leadsAreDurable();
  const mode = getLeadsStorageMode();
  const storageLabel = getLeadsStorageLabel();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">Leads</h1>
      <p className="mt-1 text-sm text-muted">
        {leads.length} total · storage: {storageLabel}
      </p>

      {!durable && (
        <div className="mt-4 rounded-2xl border border-blaze/40 bg-[var(--danger-soft)] px-4 py-4 text-sm text-charcoal">
          <p className="font-semibold text-blaze">
            Why buy/sell forms don’t show up here yet
          </p>
          <p className="mt-2 leading-relaxed text-muted">
            On free Vercel hosting, each form submit can land on a different
            temporary server. Those servers don’t share memory — so the customer
            sees “You’re on Brandon’s list,” but{" "}
            <strong className="text-charcoal">Admin → Leads</strong> often
            stays empty.
          </p>
          <p className="mt-2 leading-relaxed text-muted">
            <strong className="text-charcoal">Fix (free, ~3 minutes):</strong>{" "}
            create an Upstash Redis database and add two environment variables
            in Vercel. Steps are in{" "}
            <Link href="/admin/scale" className="font-semibold text-forest underline">
              Scale
            </Link>{" "}
            and in the project <code className="text-xs">DEPLOY.md</code>{" "}
            (“Keep leads permanently”).
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted">
            <li>
              Go to{" "}
              <a
                href="https://console.upstash.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest underline"
              >
                console.upstash.com
              </a>{" "}
              → create free Redis DB
            </li>
            <li>Copy REST URL + REST TOKEN</li>
            <li>
              Vercel → Project → Settings → Environment Variables → add{" "}
              <code className="text-xs">UPSTASH_REDIS_REST_URL</code> and{" "}
              <code className="text-xs">UPSTASH_REDIS_REST_TOKEN</code>
            </li>
            <li>Redeploy → fill Sell/Buy again → they appear here permanently</li>
          </ol>
        </div>
      )}

      {durable && mode === "redis" && (
        <div className="mt-4 rounded-2xl border border-moss/40 bg-limestone/50 px-4 py-3 text-sm text-muted">
          Leads are saved in permanent storage. Buy + Sell + Contact all land in
          this table.
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-limestone/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-3">When</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Stage</th>
              <th className="px-3 py-3">Source</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-muted">
                  {durable
                    ? "No leads yet. Submit Mission Lab or Sell on the public site, then refresh this page."
                    : "Empty for now — enable permanent storage above, then re-test a form."}
                </td>
              </tr>
            )}
            {leads.map((l) => {
              const band = scoreLabel(l.score);
              return (
                <tr key={l.id} className="border-b border-line/70 align-top">
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-3 font-medium">{l.name}</td>
                  <td className="px-3 py-3 capitalize">{l.type}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        band === "hot"
                          ? "bg-blaze/15 text-blaze"
                          : band === "warm"
                            ? "bg-umber/15 text-soil"
                            : "bg-limestone text-muted"
                      }`}
                    >
                      {l.score} {band}
                    </span>
                  </td>
                  <td className="px-3 py-3 capitalize">{l.stage}</td>
                  <td className="px-3 py-3 text-xs">{l.source}</td>
                  <td className="px-3 py-3 text-xs">
                    <div>{l.email}</div>
                    <div>{l.phone}</div>
                    {l.mission && (
                      <div className="text-moss">mission: {l.mission}</div>
                    )}
                    {l.counties?.length > 0 && (
                      <div className="text-muted">{l.counties.join(", ")}</div>
                    )}
                    {l.readinessScore != null && (
                      <div>readiness: {l.readinessScore}</div>
                    )}
                  </td>
                  <td className="max-w-xs px-3 py-3 text-xs text-muted">
                    {l.notes}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
