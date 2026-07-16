"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Listing, MissionId } from "@/lib/types";
import { formatPrice, pricePerAcre } from "@/lib/format";
import { MISSIONS } from "@/lib/types";
import Link from "next/link";

export function ListingsManager({ initial }: { initial: Listing[] }) {
  const router = useRouter();
  const [listings, setListings] = useState(initial);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    acres: "",
    county: "",
    lat: "39.3",
    lng: "-82.5",
    addressDisplay: "",
    story: "",
    brandonNotes: "",
    features: "",
    missions: ["homestead"] as MissionId[],
    status: "active",
    accessNotes: "",
    utilities: "",
  });

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          title: form.title,
          price: Number(form.price),
          acres: Number(form.acres),
          county: form.county,
          lat: Number(form.lat),
          lng: Number(form.lng),
          addressDisplay: form.addressDisplay,
          story: form.story,
          brandonNotes: form.brandonNotes,
          features: form.features,
          missions: form.missions,
          status: form.status,
          accessNotes: form.accessNotes,
          utilities: form.utilities,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setListings((prev) => [data.listing as Listing, ...prev]);
      setStatus("Listing published.");
      setOpen(false);
      setForm((f) => ({
        ...f,
        title: "",
        price: "",
        acres: "",
        county: "",
        story: "",
        brandonNotes: "",
        features: "",
      }));
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this listing from the live site?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setListings((prev) => prev.filter((l) => l.id !== id));
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function setListingStatus(id: string, next: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id, status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setListings((prev) =>
        prev.map((l) => (l.id === id ? (data.listing as Listing) : l)),
      );
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  function toggleMission(id: MissionId) {
    setForm((f) => ({
      ...f,
      missions: f.missions.includes(id)
        ? f.missions.filter((m) => m !== id)
        : [...f.missions, id],
    }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {listings.length} listing{listings.length === 1 ? "" : "s"} in live
          inventory — only real properties you add.
        </p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full btn-action px-4 py-2 text-sm font-semibold"
        >
          {open ? "Cancel" : "Add live listing"}
        </button>
      </div>
      {status && <p className="text-sm text-gold">{status}</p>}

      {open && (
        <form onSubmit={create} className="surface-card space-y-3 p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            New listing (goes live on the public site)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              Title *
              <input
                required
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Price ($) *
              <input
                required
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Acres *
              <input
                required
                type="number"
                min={0}
                step="0.1"
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.acres}
                onChange={(e) => setForm({ ...form, acres: e.target.value })}
              />
            </label>
            <label className="text-sm">
              County *
              <input
                required
                placeholder="Vinton"
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.county}
                onChange={(e) => setForm({ ...form, county: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Status
              <select
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">active</option>
                <option value="pending">pending</option>
                <option value="draft">draft</option>
                <option value="sold">sold</option>
              </select>
            </label>
            <label className="text-sm">
              Latitude (map pin)
              <input
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Longitude (map pin)
              <input
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Display location
              <input
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.addressDisplay}
                onChange={(e) =>
                  setForm({ ...form, addressDisplay: e.target.value })
                }
                placeholder="Near McArthur, OH"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Story *
              <textarea
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.story}
                onChange={(e) => setForm({ ...form, story: e.target.value })}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Brandon&apos;s walk notes
              <textarea
                rows={2}
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.brandonNotes}
                onChange={(e) =>
                  setForm({ ...form, brandonNotes: e.target.value })
                }
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Features (comma-separated)
              <input
                className="mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Timber, creek, road frontage"
              />
            </label>
          </div>
          <fieldset>
            <legend className="text-sm font-medium">Missions</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {MISSIONS.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={form.missions.includes(m.id)}
                    onChange={() => toggleMission(m.id)}
                  />
                  {m.short}
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full btn-action px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Saving…" : "Publish listing"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-limestone/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">County</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">$/ac</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted">
                  No listings yet. Add a real property above.
                </td>
              </tr>
            )}
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-line/70">
                <td className="px-3 py-3">
                  <Link
                    href={`/listings/${l.slug}`}
                    className="font-medium text-forest hover:underline"
                  >
                    {l.title}
                  </Link>
                </td>
                <td className="px-3 py-3">
                  <select
                    className="rounded border border-line bg-limestone px-1 py-0.5 text-xs"
                    value={l.status}
                    disabled={busy}
                    onChange={(e) => setListingStatus(l.id, e.target.value)}
                  >
                    <option value="active">active</option>
                    <option value="pending">pending</option>
                    <option value="draft">draft</option>
                    <option value="sold">sold</option>
                    <option value="withdrawn">withdrawn</option>
                  </select>
                </td>
                <td className="px-3 py-3">{l.county}</td>
                <td className="px-3 py-3">{formatPrice(l.price)}</td>
                <td className="px-3 py-3">{formatPrice(pricePerAcre(l))}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(l.id)}
                    className="text-xs font-semibold text-blaze hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
