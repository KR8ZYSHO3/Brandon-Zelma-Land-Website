import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { readLeads } from "@/lib/leads-store";
import { AdminNav } from "@/components/admin/AdminNav";
import { scoreLabel } from "@/lib/scoring";

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const leads = await readLeads();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">Leads</h1>
      <p className="mt-1 text-sm text-muted">
        {leads.length} total · stored in <code>data/leads.json</code>
      </p>

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
                  No leads yet. Submit Mission Lab or Sell forms on the public site.
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
                    {l.mission && <div className="text-moss">mission: {l.mission}</div>}
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
