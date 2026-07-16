"use client";

import { useEffect, useRef, useState } from "react";
import type { MissionId } from "@/lib/types";
import { MISSIONS, FOCUS_COUNTIES } from "@/lib/types";

type CountyOpt = { slug: string; name: string; state?: string };

export function WatchRadarForm({
  defaultMission,
}: {
  defaultMission?: MissionId;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [matchHint, setMatchHint] = useState("");
  const [counties, setCounties] = useState<CountyOpt[]>(
    FOCUS_COUNTIES.map((c) => ({ slug: c.slug, name: c.name })),
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/markets")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const active = (data.activeMarkets || []) as CountyOpt[];
        if (active.length) setCounties(active);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    setStatus("loading");
    setError("");
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || undefined,
      mission: String(fd.get("mission") || defaultMission || "homestead"),
      counties: fd.getAll("counties").map(String),
      budgetMax: fd.get("budgetMax") ? Number(fd.get("budgetMax")) : undefined,
      acresMin: fd.get("acresMin") ? Number(fd.get("acresMin")) : undefined,
      acresMax: fd.get("acresMax") ? Number(fd.get("acresMax")) : undefined,
      notes: String(fd.get("notes") || ""),
    };
    try {
      const res = await fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.matches?.length) {
        setMatchHint(
          `${data.matches.length} live tract(s) already look like a fit — Brandon will prioritize outreach.`,
        );
      } else {
        setMatchHint(
          "No perfect live match yet — you’re on the Watch Radar when inventory hits.",
        );
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  if (status === "done") {
    return (
      <div className="surface-card p-6 text-center">
        <p className="font-display text-xl font-semibold text-forest">
          You’re on Watch Radar.
        </p>
        <p className="mt-2 text-sm text-muted">
          Brandon gets your mission, counties, and budget. When a tract scores a
          strong Land Fit, you’re first in line.
        </p>
        {matchHint && (
          <p className="mt-3 text-sm font-medium text-forest">{matchHint}</p>
        )}
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 text-charcoal outline-none focus:border-moss";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="surface-card space-y-4 p-6"
    >
      <div>
        <p className="section-kicker">Buyer Watch Radar</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-forest">
          Get alerted when land fits your mission
        </h3>
        <p className="mt-1 text-sm text-muted">
          Not a portal blast — a private watch for Brandon’s live book in your
          counties.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Name</span>
          <input name="name" required className={field} autoComplete="name" />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            className={field}
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Phone</span>
          <input name="phone" type="tel" className={field} autoComplete="tel" />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Mission</span>
          <select
            name="mission"
            className={field}
            defaultValue={defaultMission || ""}
            required
          >
            <option value="">Select…</option>
            {MISSIONS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Counties to watch</legend>
        <div className="mt-2 grid max-h-40 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
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

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium">Max budget ($)</span>
          <input name="budgetMax" type="number" min={0} className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Min acres</span>
          <input name="acresMin" type="number" min={0} className={field} />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Max acres</span>
          <input name="acresMax" type="number" min={0} className={field} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Notes</span>
        <textarea
          name="notes"
          rows={2}
          className={field}
          placeholder="Must have road frontage, no floodplain, timber for stand, etc."
        />
      </label>

      {error && <p className="text-sm text-blaze">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full btn-action px-5 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {status === "loading" ? "Saving watch…" : "Activate Watch Radar"}
      </button>
    </form>
  );
}
