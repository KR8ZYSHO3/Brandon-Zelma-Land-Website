"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClosedDeal, MarketComp } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function MarketBookManager({
  initialComps,
  initialClosed,
}: {
  initialComps: MarketComp[];
  initialClosed: ClosedDeal[];
}) {
  const router = useRouter();
  const [comps, setComps] = useState(initialComps);
  const [closed, setClosed] = useState(initialClosed);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [compForm, setCompForm] = useState({
    county: "",
    acres: "",
    price: "",
    saleDate: new Date().toISOString().slice(0, 10),
    landType: "",
    sourceNote: "",
  });
  const [closedForm, setClosedForm] = useState({
    county: "",
    acres: "",
    price: "",
    closedAt: new Date().toISOString().slice(0, 10),
    landType: "",
    side: "list",
    notes: "",
  });

  async function addComp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/market-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "comp", ...compForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setComps((c) => [data.comp as MarketComp, ...c]);
      setMsg("Comp logged.");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function addClosed(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/market-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "closed", ...closedForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setClosed((c) => [data.deal as ClosedDeal, ...c]);
      setMsg("Closed deal logged.");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function removeComp(id: string) {
    if (!confirm("Delete this comp?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/market-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", kind: "comp", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setComps((c) => c.filter((x) => x.id !== id));
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function removeClosed(id: string) {
    if (!confirm("Delete this closed deal?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/market-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", kind: "closed", id }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      setClosed((c) => c.filter((x) => x.id !== id));
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      {msg && <p className="text-sm text-gold">{msg}</p>}

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addComp} className="surface-card space-y-3 p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Log a real comp
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              required
              placeholder="County"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={compForm.county}
              onChange={(e) =>
                setCompForm({ ...compForm, county: e.target.value })
              }
            />
            <input
              required
              placeholder="Land type"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={compForm.landType}
              onChange={(e) =>
                setCompForm({ ...compForm, landType: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Acres"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={compForm.acres}
              onChange={(e) =>
                setCompForm({ ...compForm, acres: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Price"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={compForm.price}
              onChange={(e) =>
                setCompForm({ ...compForm, price: e.target.value })
              }
            />
            <input
              type="date"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm sm:col-span-2"
              value={compForm.saleDate}
              onChange={(e) =>
                setCompForm({ ...compForm, saleDate: e.target.value })
              }
            />
            <input
              placeholder="Source note"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm sm:col-span-2"
              value={compForm.sourceNote}
              onChange={(e) =>
                setCompForm({ ...compForm, sourceNote: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full btn-action px-4 py-2 text-sm font-semibold"
          >
            Save comp
          </button>
        </form>

        <form onSubmit={addClosed} className="surface-card space-y-3 p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Log a closed deal (your book)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              required
              placeholder="County"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.county}
              onChange={(e) =>
                setClosedForm({ ...closedForm, county: e.target.value })
              }
            />
            <select
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.side}
              onChange={(e) =>
                setClosedForm({ ...closedForm, side: e.target.value })
              }
            >
              <option value="list">list side</option>
              <option value="buy">buy side</option>
              <option value="dual">dual</option>
            </select>
            <input
              required
              type="number"
              placeholder="Acres"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.acres}
              onChange={(e) =>
                setClosedForm({ ...closedForm, acres: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Price"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.price}
              onChange={(e) =>
                setClosedForm({ ...closedForm, price: e.target.value })
              }
            />
            <input
              type="date"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.closedAt}
              onChange={(e) =>
                setClosedForm({ ...closedForm, closedAt: e.target.value })
              }
            />
            <input
              placeholder="Land type"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm"
              value={closedForm.landType}
              onChange={(e) =>
                setClosedForm({ ...closedForm, landType: e.target.value })
              }
            />
            <input
              placeholder="Notes"
              className="rounded-xl border border-line bg-limestone px-3 py-2 text-sm sm:col-span-2"
              value={closedForm.notes}
              onChange={(e) =>
                setClosedForm({ ...closedForm, notes: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full btn-action px-4 py-2 text-sm font-semibold"
          >
            Save closed deal
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-forest">
          Comps journal
        </h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-limestone/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">County</th>
                <th className="px-3 py-2">Acres</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">$/ac</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Note</th>
                <th className="px-3 py-2"> </th>
              </tr>
            </thead>
            <tbody>
              {comps.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-muted">
                    No comps logged yet.
                  </td>
                </tr>
              )}
              {comps.map((c) => (
                <tr key={c.id} className="border-b border-line/70">
                  <td className="px-3 py-2">{c.county}</td>
                  <td className="px-3 py-2">{c.acres}</td>
                  <td className="px-3 py-2">{formatPrice(c.price)}</td>
                  <td className="px-3 py-2">{formatPrice(c.pricePerAcre)}</td>
                  <td className="px-3 py-2">{c.saleDate}</td>
                  <td className="px-3 py-2">{c.landType}</td>
                  <td className="px-3 py-2 text-xs text-muted">{c.sourceNote}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void removeComp(c.id)}
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
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-forest">
          Your closed book
        </h2>
        <ul className="mt-3 space-y-2">
          {closed.length === 0 && (
            <li className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-muted">
              No closed deals logged yet.
            </li>
          )}
          {closed.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-sm"
            >
              <div>
                <span className="font-medium">
                  {d.county} · {d.acres} ac · {formatPrice(d.price)}
                </span>
                <span className="text-muted">
                  {" "}
                  ({formatPrice(d.pricePerAcre)}/ac) · {d.side} · {d.closedAt}
                </span>
                {d.notes && (
                  <p className="mt-1 text-xs text-muted">{d.notes}</p>
                )}
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void removeClosed(d.id)}
                className="text-xs font-semibold text-blaze hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
