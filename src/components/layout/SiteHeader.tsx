"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/find", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings", label: "Listings" },
  { href: "/map", label: "Map" },
  { href: "/how-we-work", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/95 backdrop-blur-md">
      <div className="border-b border-line/50 bg-limestone/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
          <Link href="/" className="group flex flex-col">
            <span className="font-display text-lg font-semibold tracking-tight text-forest sm:text-xl">
              Brandon Zelma Land
            </span>
            <span className="text-[11px] font-medium tracking-wide text-muted">
              Ohio Land Pro · Southeast Ohio
            </span>
          </Link>
          <div className="flex flex-col items-end text-right">
            <span className="font-display text-lg font-semibold tracking-tight text-forest sm:text-xl">
              Buckeye Land Sales
            </span>
            <span className="text-[11px] font-medium tracking-wide text-muted">
              Licensed salesperson · Ohio
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-charcoal/90 transition hover:bg-limestone hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border border-line px-3 py-1.5 text-sm font-medium md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Menu
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden text-xs text-muted hover:text-forest sm:inline"
          >
            Admin
          </Link>
          <Link
            href="/find"
            className="rounded-full btn-action px-4 py-2 text-sm font-semibold shadow-sm"
          >
            Start a mission
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-limestone"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
