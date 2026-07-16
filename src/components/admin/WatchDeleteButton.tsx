"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function WatchDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Remove this watch?")) return;
    setBusy(true);
    try {
      await fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void remove()}
      className="text-xs font-semibold text-blaze hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
