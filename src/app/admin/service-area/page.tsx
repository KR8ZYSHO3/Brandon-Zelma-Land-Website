import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { ServiceAreaManager } from "@/components/admin/ServiceAreaManager";
import {
  getServiceArea,
  getServiceAreaStorageLabel,
  serviceAreaIsDurable,
} from "@/lib/markets-store";

export const dynamic = "force-dynamic";

export default async function AdminServiceAreaPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const config = await getServiceArea();
  const durable = serviceAreaIsDurable();
  const storageLabel = getServiceAreaStorageLabel();
  const activeCount = config.markets.filter((m) => m.active).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Map · coverage · scale</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Service area
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Control which counties/states appear on the public map and buyer forms.
        Start local — expand statewide or multi-state when ready. Listings you
        add in those markets will pin on the same map.
      </p>
      <p className="mt-2 text-sm text-muted">
        Storage: {storageLabel} · {activeCount} markets on · label:{" "}
        <strong className="text-charcoal">{config.regionLabel}</strong>
      </p>
      {!durable && (
        <div className="mt-3 rounded-xl border border-blaze/40 bg-[var(--danger-soft)] px-4 py-3 text-sm text-muted">
          Without Upstash Redis, Service Area saves won’t stick on the public
          Land IQ map (same fix as leads — env vars + redeploy).
        </div>
      )}
      <p className="mt-2 text-sm">
        Public map:{" "}
        <Link
          href="/map"
          target="_blank"
          className="text-forest hover:underline"
        >
          /map ↗
        </Link>{" "}
        (hard-refresh after changing presets)
      </p>
      <div className="mt-8">
        <ServiceAreaManager initial={config} />
      </div>
    </div>
  );
}
