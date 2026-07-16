"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Command", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/test-lab", label: "Test Lab" },
  { href: "/admin/service-area", label: "Service Area" },
  { href: "/admin/market", label: "Market" },
  { href: "/admin/business-plan", label: "Business Plan" },
  { href: "/admin/seo", label: "SEO / AI SEO" },
  { href: "/admin/security", label: "Security" },
  { href: "/admin/business-dev", label: "VA Path" },
  { href: "/admin/va-loans", label: "VA Loans" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/ai", label: "AI" },
  { href: "/admin/scale", label: "Scale" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact || href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname() || "";

  function go(href: string, e: React.MouseEvent) {
    // Already here — scroll to top so it feels responsive
    if (isActive(pathname, href, href === "/admin")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Full navigation is more reliable on serverless admin than soft client nav
    e.preventDefault();
    window.location.assign(href);
  }

  return (
    <div className="mb-8 space-y-3 border-b border-line pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            onClick={(e) => go("/admin", e)}
            className="font-display text-lg font-semibold text-forest hover:underline"
          >
            Brandon Zelma Land · OS
          </Link>
          <p className="text-xs text-muted">
            Private cockpit ·{" "}
            <Link
              href="/admin"
              onClick={(e) => go("/admin", e)}
              className="font-semibold text-forest underline-offset-2 hover:underline"
            >
              Command
            </Link>{" "}
            is home
          </p>
        </div>
        <LogoutButton />
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Admin">
        {LINKS.map((l) => {
          const active = isActive(pathname, l.href, "exact" in l && l.exact);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => go(l.href, e)}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? "border-moss bg-forest text-cream"
                  : "border-line bg-paper text-forest hover:border-moss hover:bg-limestone"
              }`}
            >
              {l.label}
              {active && l.href === "/admin" ? " · home" : ""}
            </Link>
          );
        })}
      </nav>
      {pathname === "/admin" && (
        <p className="text-xs text-muted">
          You&apos;re on <strong className="text-charcoal">Command</strong>{" "}
          (daily home). Open <strong className="text-charcoal">Leads</strong>{" "}
          for form submissions. Cheat sheet is below on this page.
        </p>
      )}
    </div>
  );
}
