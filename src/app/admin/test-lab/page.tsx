import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { TestPackManager } from "@/components/admin/TestPackManager";
import {
  countTestPack,
  getCustomerWalkthroughLinks,
  TEST_TAG,
} from "@/lib/test-pack";
import {
  getLeadsStorageLabel,
  leadsAreDurable,
} from "@/lib/leads-store";
import {
  getListingsStorageLabel,
  listingsAreDurable,
} from "@/lib/listings-store";
import {
  getMarketBookStorageLabel,
  marketBookIsDurable,
} from "@/lib/market-book-store";

export const dynamic = "force-dynamic";

export default async function AdminTestLabPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const counts = await countTestPack();
  const walkthrough = await getCustomerWalkthroughLinks();
  const durable =
    leadsAreDurable() && listingsAreDurable() && marketBookIsDurable();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Customer site + CRM</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Test Lab
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Load fake tracts tagged <code className="text-xs">{TEST_TAG}</code> so the{" "}
        <strong className="text-charcoal">public customer site</strong> (Buy,
        Sell, Listings, Map, Counties) and admin CRM can be walked end-to-end —
        then wipe in one click.
      </p>

      <div className="mt-4 rounded-xl border border-line bg-limestone/40 px-4 py-3 text-xs text-muted">
        Storage — leads: {getLeadsStorageLabel()} · listings:{" "}
        {getListingsStorageLabel()} · market: {getMarketBookStorageLabel()}
        {!durable && (
          <span className="mt-1 block font-semibold text-blaze">
            Upstash Redis env vars required or data will not stick on Vercel.
          </span>
        )}
      </div>

      <div className="mt-8">
        <TestPackManager
          initialCounts={counts}
          walkthrough={walkthrough}
        />
      </div>
    </div>
  );
}
