import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Command" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/market", label: "Market" },
  { href: "/admin/business-plan", label: "Business Plan" },
  { href: "/admin/business-dev", label: "VA Path" },
  { href: "/admin/va-loans", label: "VA Loans" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/ai", label: "AI" },
  { href: "/admin/scale", label: "Scale" },
];

export function AdminNav() {
  return (
    <div className="mb-8 space-y-3 border-b border-line pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-forest">
            Brandon Zelma Land · OS
          </p>
          <p className="text-xs text-muted">
            Private cockpit · start at Command if lost
          </p>
        </div>
        <LogoutButton />
      </div>
      <nav className="flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-forest transition hover:border-moss hover:bg-limestone"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
