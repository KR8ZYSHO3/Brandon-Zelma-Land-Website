"use client";

import { useMemo, useState } from "react";
import type { MarketArea, ServiceAreaConfig } from "@/lib/types";
import { REGION_PRESETS } from "@/lib/data/default-markets";

export function ServiceAreaManager({
  initial,
}: {
  initial: ServiceAreaConfig;
}) {
  const [config, setConfig] = useState(initial);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "off">("all");
  const [stateFilter, setStateFilter] = useState("ALL");

  const [newName, setNewName] = useState("");
  const [newState, setNewState] = useState("OH");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [newBlurb, setNewBlurb] = useState("");

  const states = useMemo(() => {
    const s = new Set(config.markets.map((m) => m.state));
    return ["ALL", ...Array.from(s).sort()];
  }, [config.markets]);

  const visible = useMemo(() => {
    return config.markets
      .filter((m) => (stateFilter === "ALL" ? true : m.state === stateFilter))
      .filter((m) =>
        filter === "all" ? true : filter === "active" ? m.active : !m.active,
      )
      .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
  }, [config.markets, filter, stateFilter]);

  const activeCount = config.markets.filter((m) => m.active).length;

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setConfig(data.config as ServiceAreaConfig);
      setStatus("Saved.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  function toggle(m: MarketArea) {
    void post({ action: "toggle", slug: m.slug, active: !m.active });
  }

  function saveLabels(e: React.FormEvent) {
    e.preventDefault();
    void post({
      action: "labels",
      regionLabel: config.regionLabel,
      regionBlurb: config.regionBlurb,
    });
  }

  function addMarket(e: React.FormEvent) {
    e.preventDefault();
    void post({
      action: "add",
      name: newName,
      state: newState,
      lat: Number(newLat),
      lng: Number(newLng),
      blurb: newBlurb,
      active: true,
    }).then(() => {
      setNewName("");
      setNewLat("");
      setNewLng("");
      setNewBlurb("");
    });
  }

  return (
    <div className="space-y-8">
      <div className="surface-elevated p-5">
        <p className="section-kicker">What this controls</p>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Active markets show on the <strong className="text-charcoal">Land IQ map</strong>,
          buyer county checkboxes, Field Notes county links, and county SEO pages.
          Listings still come from your listing book — this expands{" "}
          <em>where you market and map</em>, including outside SE Ohio.
        </p>
        <p className="mt-2 text-sm text-forest font-semibold">
          {activeCount} markets on · region: {config.regionLabel}
        </p>
        {status && (
          <p className="mt-2 text-xs text-gold">{status}</p>
        )}
      </div>

      <form onSubmit={saveLabels} className="surface-card p-5 space-y-3">
        <h2 className="font-display text-lg font-semibold text-forest">
          Map region label
        </h2>
        <label className="block text-sm">
          <span className="text-muted">Label on public map</span>
          <input
            className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 text-charcoal"
            value={config.regionLabel}
            onChange={(e) =>
              setConfig((c) => ({ ...c, regionLabel: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Short description</span>
          <textarea
            rows={2}
            className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 text-charcoal"
            value={config.regionBlurb}
            onChange={(e) =>
              setConfig((c) => ({ ...c, regionBlurb: e.target.value }))
            }
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full btn-action px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Save labels
        </button>
      </form>

      <section>
        <h2 className="font-display text-xl font-semibold text-forest">
          One-click expand
        </h2>
        <p className="mt-1 text-sm text-muted">
          Jump from local SE Ohio to wider Ohio or neighboring states. You can
          fine-tune toggles after.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {REGION_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={busy}
              onClick={() => void post({ action: "preset", presetId: p.id })}
              className="surface-card p-4 text-left transition hover:border-moss disabled:opacity-60"
            >
              <p className="font-semibold text-forest">{p.label}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-forest">
            Markets on / off
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["all", "active", "off"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 font-semibold ${
                  filter === f
                    ? "btn-action"
                    : "border border-line bg-paper text-muted"
                }`}
              >
                {f}
              </button>
            ))}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-full border border-line bg-limestone px-3 py-1 text-charcoal"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All states" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {visible.map((m) => (
            <li
              key={m.slug}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-charcoal">
                  {m.name}{" "}
                  <span className="text-muted font-normal">({m.state})</span>
                </p>
                <p className="text-xs text-muted line-clamp-1">{m.blurb}</p>
                <p className="text-[10px] text-muted">
                  {m.lat.toFixed(2)}, {m.lng.toFixed(2)} · /counties/{m.slug}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => toggle(m)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  m.active
                    ? "bg-moss/30 text-forest border border-moss"
                    : "border border-line text-muted"
                }`}
              >
                {m.active ? "ON · click to turn off" : "OFF · click to turn on"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={addMarket} className="surface-card p-5 space-y-3">
        <h2 className="font-display text-lg font-semibold text-forest">
          Add a custom market
        </h2>
        <p className="text-xs text-muted">
          Any county / region with a map pin. Look up lat/lng once (Google Maps
          right-click → coordinates).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Name
            <input
              required
              placeholder="Adams County"
              className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
          <label className="text-sm">
            State
            <input
              required
              maxLength={2}
              className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 uppercase"
              value={newState}
              onChange={(e) => setNewState(e.target.value.toUpperCase())}
            />
          </label>
          <label className="text-sm">
            Latitude
            <input
              required
              placeholder="38.85"
              className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Longitude
            <input
              required
              placeholder="-83.47"
              className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
              value={newLng}
              onChange={(e) => setNewLng(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm">
          Blurb (optional)
          <input
            className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
            value={newBlurb}
            onChange={(e) => setNewBlurb(e.target.value)}
            placeholder="Why this market matters…"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full btn-action px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Add market (turns ON)
        </button>
      </form>
    </div>
  );
}
