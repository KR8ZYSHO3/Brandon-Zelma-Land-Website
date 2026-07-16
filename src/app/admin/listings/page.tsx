import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { ListingsManager } from "@/components/admin/ListingsManager";
import {
  getListingsStorageLabel,
  listingsAreDurable,
  readListings,
} from "@/lib/listings-store";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const listings = await readListings();
  const durable = listingsAreDurable();
  const storageLabel = getListingsStorageLabel();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">
        Live listings
      </h1>
      <p className="mt-1 text-sm text-muted">
        Only real inventory. What you publish here shows on the public site, map,
        and Mission Lab matches. Storage: {storageLabel}
      </p>
      {!durable && (
        <div className="mt-4 rounded-2xl border border-blaze/40 bg-[var(--danger-soft)] px-4 py-3 text-sm text-muted">
          Listings need the same Upstash Redis env vars as leads (already one
          free database — no second DB). Redeploy after adding them.
        </div>
      )}
      <div className="mt-8">
        <ListingsManager initial={listings} />
      </div>
      <div className="mt-8 rounded-xl border border-dashed border-line p-4 text-sm text-muted">
        <p className="font-semibold text-charcoal">After you publish</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Dossier live on /listings</li>
          <li>Pin on Land IQ map</li>
          <li>County page if that market is ON in Service Area</li>
          <li>Film walk / social / email launch</li>
        </ul>
      </div>
    </div>
  );
}
