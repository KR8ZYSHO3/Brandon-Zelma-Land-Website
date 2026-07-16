"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lead } from "@/lib/types";
import { scoreLabel } from "@/lib/scoring";
import { TEST_TAG } from "@/lib/test-tag";

export function LeadsTable({ initial }: { initial: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    setBusy(id);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      router.refresh();
    } catch {
      alert("Could not delete lead");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
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
            <th className="px-3 py-3"> </th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-8 text-center text-muted">
                No leads yet. Use Test Lab or submit public Buy/Sell forms.
              </td>
            </tr>
          )}
          {leads.map((l) => {
            const band = scoreLabel(l.score);
            const isTest = l.name.includes(TEST_TAG) || l.notes.includes(TEST_TAG);
            return (
              <tr key={l.id} className="border-b border-line/70 align-top">
                <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-3 font-medium">
                  {l.name}
                  {isTest && (
                    <span className="ml-1 text-[10px] font-bold text-blaze">
                      TEST
                    </span>
                  )}
                </td>
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
                <td className="px-3 py-3">
                  <button
                    type="button"
                    disabled={busy === l.id}
                    onClick={() => void remove(l.id)}
                    className="text-xs font-semibold text-blaze hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
