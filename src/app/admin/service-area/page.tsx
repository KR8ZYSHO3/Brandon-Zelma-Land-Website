import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { ServiceAreaManager } from "@/components/admin/ServiceAreaManager";
import { getServiceArea } from "@/lib/markets-store";

export default async function AdminServiceAreaPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const config = await getServiceArea();

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
      <p className="mt-2 text-sm">
        Public map:{" "}
        <Link href="/map" className="text-forest hover:underline">
          /map
        </Link>
      </p>
      <div className="mt-8">
        <ServiceAreaManager initial={config} />
      </div>
    </div>
  );
}
