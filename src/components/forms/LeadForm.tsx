"use client";

import { useEffect, useState } from "react";
import type { LeadType, MissionId } from "@/lib/types";
import { MISSIONS, FOCUS_COUNTIES } from "@/lib/types";

type CountyOpt = { slug: string; name: string; state?: string };

export function LeadForm({
  type,
  defaultMission,
  source,
  readinessScore,
  extraPayload,
}: {
  type: LeadType;
  defaultMission?: MissionId;
  source: string;
  readinessScore?: number;
  extraPayload?: Record<string, unknown>;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [counties, setCounties] = useState<CountyOpt[]>(
    FOCUS_COUNTIES.map((c) => ({ slug: c.slug, name: c.name })),
  );

  useEffect(() => {
    fetch("/api/markets")
      .then((r) => r.json())
      .then((data) => {
        const active = (data.activeMarkets || []) as {
          slug: string;
          name: string;
          state?: string;
        }[];
        if (active.length) {
          setCounties(
            active.map((m) => ({
              slug: m.slug,
              name: m.name,
              state: m.state,
            })),
          );
        }
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    const counties = fd.getAll("counties").map(String);

    const body = {
      type,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      source,
      mission: String(fd.get("mission") || defaultMission || "") || undefined,
      counties,
      budgetMax: fd.get("budgetMax") ? Number(fd.get("budgetMax")) : undefined,
      acresMin: fd.get("acresMin") ? Number(fd.get("acresMin")) : undefined,
      timeline: String(fd.get("timeline") || "") || undefined,
      notes: String(fd.get("notes") || ""),
      readinessScore,
      payload: extraPayload,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("done");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  if (status === "done") {
    return (
      <div className="surface-card p-6 text-center">
        <p className="font-display text-xl font-semibold text-forest">
          You&apos;re on Brandon&apos;s list.
        </p>
        <p className="mt-2 text-sm text-muted">
          Expect a personal follow-up. Hot leads get same-day contact when
          possible.
        </p>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 text-charcoal outline-none focus:border-moss";

  return (
    <form onSubmit={onSubmit} className="surface-card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-charcoal">Name</span>
          <input name="name" required className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-charcoal">Email</span>
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-charcoal">Phone</span>
          <input name="phone" type="tel" className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-charcoal">Timeline</span>
          <select name="timeline" className={field} defaultValue="">
            <option value="">Select…</option>
            <option value="asap-30-days">ASAP / 30 days</option>
            <option value="90-days">About 90 days</option>
            <option value="6-months">Within 6 months</option>
            <option value="1-year-plus">1 year+</option>
          </select>
        </label>
      </div>

      {type === "buyer" && (
        <>
          <label className="block text-sm">
            <span className="font-medium text-charcoal">Mission</span>
            <select
              name="mission"
              defaultValue={defaultMission || ""}
              className={field}
            >
              <option value="">Select…</option>
              {MISSIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-medium text-charcoal">
              Counties of interest
            </legend>
            <div className="mt-2 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {counties.map((c) => (
                <label key={c.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="counties"
                    value={c.name.replace(" County", "")}
                  />
                  <span>
                    {c.name.replace(" County", "")}
                    {c.state && c.state !== "OH" ? ` (${c.state})` : ""}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-charcoal">Max budget ($)</span>
              <input name="budgetMax" type="number" min={0} className={field} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-charcoal">Min acres</span>
              <input name="acresMin" type="number" min={0} className={field} />
            </label>
          </div>
        </>
      )}

      <label className="block text-sm">
        <span className="font-medium text-charcoal">Notes</span>
        <textarea
          name="notes"
          rows={3}
          className={field}
          placeholder={
            type === "seller"
              ? "Acres, county, what you’re hoping for…"
              : "What the land needs to do for you…"
          }
        />
      </label>

      {error && <p className="text-sm text-blaze">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full btn-action px-5 py-3 text-sm font-semibold transition disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : type === "seller" ? "Request seller strategy" : "Save my land mission"}
      </button>
    </form>
  );
}
