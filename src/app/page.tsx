import Link from "next/link";
import { MissionChips } from "@/components/home/MissionChips";
import { ListingCard } from "@/components/listings/ListingCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getActiveListings } from "@/lib/data/listings";
import { MISSION_STATEMENT } from "@/lib/data/business-plan";

export default function HomePage() {
  const featured = getActiveListings()
    .filter((l) => l.status === "active")
    .slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-charcoal">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 dossier-grid opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="animate-rise text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            Brandon Zelma · Buckeye Land Sales
          </p>
          <h1 className="animate-rise animate-rise-delay-1 mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-charcoal sm:text-5xl md:text-6xl">
            Stop scrolling acreage.
            <span className="block text-forest">Start understanding land.</span>
          </h1>
          <p className="animate-rise animate-rise-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Southeast Ohio hunting tracts, farms, homesteads, and timber —
            matched to your mission, documented like a field report, represented
            by a veteran who walks the fence line.
          </p>
          <div className="animate-rise animate-rise-delay-3 mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/find" variant="secondary">
              I want to buy land
            </ButtonLink>
            <ButtonLink
              href="/sell"
              variant="ghost"
              className="!border !border-line !px-5 !text-charcoal hover:!bg-limestone/60"
            >
              I want to sell land
            </ButtonLink>
          </div>

          <div className="mt-14 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3">
            {[
              ["U.S. Army veteran", "8 years of service"],
              ["Natural Resources", "Hocking College field skills"],
              ["Process", "Map · Walk · Market · Close"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                  {k}
                </p>
                <p className="mt-1 font-display text-xl text-charcoal">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="border-b border-line bg-paper/80">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="section-kicker">How a visit works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-forest">
            A clear path — not a maze of links
          </h2>
          <div className="mt-8 grid gap-4 counter-reset sm:grid-cols-2 lg:grid-cols-4" style={{ counterReset: "flow" }}>
            {[
              {
                t: "Choose a side",
                d: "Buy or sell. Everything else branches from that choice.",
                href: "/find",
              },
              {
                t: "Define the mission",
                d: "Hunt, farm, homestead, or timber — what the land must do.",
                href: "/find",
              },
              {
                t: "Study the dossier",
                d: "Field notes, access, soils, wildlife — not a bare MLS card.",
                href: "/listings",
              },
              {
                t: "Talk to Brandon",
                d: "Or ask free Land Scout AI first (button bottom-right).",
                href: "/contact",
              },
            ].map((s) => (
              <Link
                key={s.t}
                href={s.href}
                className="flow-step surface-card p-5 transition hover:border-forest/30"
              >
                <h3 className="font-display text-lg font-semibold text-forest">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{s.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MISSIONS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="section-kicker">Mission Lab</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">
            What is the land for?
          </h2>
          <p className="mt-3 text-muted leading-relaxed">
            Portals filter price and acres. We start with purpose — then match
            ground that can actually deliver.
          </p>
        </div>
        <MissionChips />
      </section>

      {/* LISTINGS */}
      <section className="border-y border-line bg-limestone/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Field dossiers</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">
                Land worth reading about
              </h2>
            </div>
            <Link
              href="/listings"
              className="text-sm font-semibold text-forest hover:underline"
            >
              All listings →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* AI + SELL dual */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="surface-elevated p-8">
          <p className="section-kicker">Free AI · Land Scout</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Ask before you drive the gravel road
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Land Scout is free and built for this site — missions, counties,
            buying/selling flow, and what’s in the book. No API key required.
            Optional Grok upgrade later for Brandon’s admin tools.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/90">
            <li>• “40 acres to hunt in Vinton”</li>
            <li>• “How do I sell my land?”</li>
            <li>• “What’s near Hocking Hills?”</li>
          </ul>
          <p className="mt-6 text-xs text-muted">
            Open the gold-dot button bottom-right anytime — or start Mission Lab.
          </p>
          <div className="mt-5">
            <ButtonLink href="/find">Open Mission Lab</ButtonLink>
          </div>
        </div>
        <div className="surface-elevated p-8">
          <p className="section-kicker">Sellers</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Inventory is the engine
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Get a Land Sale Readiness Score and a strategy conversation — not a
            mystery commission pitch. Brandon markets with modern reach and
            boots-on-ground truth.
          </p>
          <div className="mt-6">
            <ButtonLink href="/sell">Score my readiness</ButtonLink>
          </div>
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section className="border-t border-line bg-forest-mid/40 text-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            Mission
          </p>
          <blockquote className="mt-4 max-w-3xl font-display text-2xl font-semibold leading-snug text-forest sm:text-3xl">
            {MISSION_STATEMENT.short}
          </blockquote>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {MISSION_STATEMENT.full}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/about" variant="secondary">
              Meet Brandon
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" className="!text-charcoal">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
