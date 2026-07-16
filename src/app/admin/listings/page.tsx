import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LISTINGS, formatPrice, pricePerAcre } from "@/lib/data/listings";

export default async function AdminListingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <h1 className="font-display text-3xl font-semibold text-forest">
        Listings ops
      </h1>
      <p className="mt-1 text-sm text-muted">
        Listing inventory is empty until properties are added. Manage via your
        data store / CMS as you go live.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-limestone/50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">County</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">$/ac</th>
              <th className="px-3 py-3">Views</th>
              <th className="px-3 py-3">CTAs</th>
            </tr>
          </thead>
          <tbody>
            {LISTINGS.map((l) => (
              <tr key={l.id} className="border-b border-line/70">
                <td className="px-3 py-3">
                  <Link
                    href={`/listings/${l.slug}`}
                    className="font-medium text-forest hover:underline"
                  >
                    {l.title}
                  </Link>
                </td>
                <td className="px-3 py-3 capitalize">{l.status}</td>
                <td className="px-3 py-3">{l.county}</td>
                <td className="px-3 py-3">{formatPrice(l.price)}</td>
                <td className="px-3 py-3">{formatPrice(pricePerAcre(l))}</td>
                <td className="px-3 py-3">{l.views}</td>
                <td className="px-3 py-3">{l.ctaClicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-line p-4 text-sm text-muted">
        <p className="font-semibold text-charcoal">Listing launch kit checklist</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Dossier live on site</li>
          <li>Pin on Land IQ</li>
          <li>County page linked</li>
          <li>IG/FB caption + YouTube walk</li>
          <li>Email blast to list</li>
          <li>Sphere text to past buyers</li>
        </ul>
      </div>
    </div>
  );
}
