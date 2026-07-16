import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-semibold text-charcoal">
            Brandon Zelma Land
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Southeast Ohio land — hunting tracts, farms, homesteads, and timber —
            explained by someone who walks it. Field-report marketing with
            Buckeye Land Sales.
          </p>
          <p className="mt-4 text-sm italic text-gold/90">
            Help people buy and sell real land with boots-on-the-ground honesty.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage">
            Journey
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/find" className="hover:text-charcoal">
                Buy — Mission Lab
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-charcoal">
                Sell — Readiness score
              </Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-charcoal">
                Land IQ map
              </Link>
            </li>
            <li>
              <Link href="/listings" className="hover:text-charcoal">
                Field dossiers
              </Link>
            </li>
            <li>
              <Link href="/how-we-work" className="hover:text-charcoal">
                How we work
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage">
            Contact
          </p>
          <p className="mt-3 text-sm">
            <a
              href="tel:7404383658"
              className="font-semibold text-charcoal hover:underline"
            >
              (740) 438-3658
            </a>
          </p>
          <p className="mt-2 text-sm text-muted">
            <Link href="/contact" className="hover:text-charcoal">
              Message Brandon →
            </Link>
          </p>
          <p className="mt-4 text-xs text-muted">
            Use free <strong className="text-sage">Land Scout AI</strong> (button
            bottom-right) anytime.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-sm sm:px-6">
          <p className="font-medium text-charcoal">
            Brandon Zelma, Real Estate Salesperson ·{" "}
            <span className="font-semibold">Buckeye Land Sales</span>
          </p>
          <p className="text-xs leading-relaxed text-muted">
            All real estate services offered through Buckeye Land Sales. Equal
            housing opportunity. Information deemed reliable but not guaranteed.
            Scores, AI guidance, and financial examples are educational — not
            appraisals, legal advice, or income guarantees.
          </p>
          <p className="text-xs text-muted/70">
            © {new Date().getFullYear()} Brandon Zelma Land
          </p>
        </div>
      </div>
    </footer>
  );
}
