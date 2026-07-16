import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "About Brandon Zelma",
  description:
    "U.S. Army veteran and Southeast Ohio Land Pro with Natural Resources training — Brandon Zelma of Buckeye Land Sales.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-moss">
        Brandon Zelma Land · Buckeye Land Sales
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-forest">
        Boots on the ground. Maps in the truck.
      </h1>
      <div className="prose-land mt-8 space-y-5 text-base leading-relaxed text-charcoal/90">
        <p>
          Brandon is a U.S. Army veteran with eight years of service and a deep
          respect for the land, lifestyle, and people that make Ohio special.
          After coming home, he studied Natural Resources at Hocking College —
          field biology, mapping/GPS, wildlife management, and native plant and
          tree identification — skills he applies daily in rural real estate.
        </p>
        <p>
          As a Land Pro with <strong>Buckeye Land Sales</strong>, Brandon helps
          clients buy and sell secluded getaways, hunting tracts, working farms,
          and rural homes across the state — with a focus on Southeast Ohio. He
          doesn&apos;t just list property; he represents the land: fence lines,
          timber character, topography, soil, and access.
        </p>
        <p>
          Raised in Southeastern Ohio, he has spent his life outdoors — hunting
          whitetails, chasing spring gobblers, hiking the Hocking Hills, and
          searching for arrowheads with family. He and his wife are raising two
          sons to love and respect the land the same way, and both serve as 4-H
          advisors.
        </p>
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          ["Service", "U.S. Army veteran — 8 years"],
          ["Education", "Natural Resources · Hocking College"],
          ["Brokerage", "Land Pro · Buckeye Land Sales"],
          ["Focus", "SE Ohio hunt, farm, homestead, timber"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-line bg-paper p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-moss">
              {k}
            </dt>
            <dd className="mt-1 font-medium text-charcoal">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/contact">Contact Brandon</ButtonLink>
        <ButtonLink href="/how-we-work" variant="secondary">
          How we work
        </ButtonLink>
      </div>
    </div>
  );
}
