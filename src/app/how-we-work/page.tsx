import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "Map, walk, market, negotiate — Brandon Zelma’s boots-on-the-ground process with Buckeye Land Sales.",
};

const STEPS = [
  {
    n: "01",
    t: "Map",
    d: "Boundaries, access, topography, and what public data can tell us before boots hit the ground.",
  },
  {
    n: "02",
    t: "Walk",
    d: "Fence lines, timber, water, wildlife sign, and the truth of the tract — not just driveway photos.",
  },
  {
    n: "03",
    t: "Market",
    d: "Field-report dossier on this site, syndication where appropriate, video, and targeted outreach to the right buyer missions.",
  },
  {
    n: "04",
    t: "Negotiate & close",
    d: "Clear communication, realistic strategy, and follow-through through Buckeye Land Sales.",
  },
];

export default function HowWeWorkPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        How we work
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        Brandon is a Land Pro with <strong>Buckeye Land Sales</strong>. The
        process is simple on purpose — because land deals fail when people skip
        the ground truth.
      </p>
      <ol className="mt-10 space-y-4">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="flex gap-4 rounded-2xl border border-line bg-paper p-5"
          >
            <span className="font-display text-2xl font-semibold text-moss">
              {s.n}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-forest">
                {s.t}
              </h2>
              <p className="mt-1 text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/sell">Sell with this process</ButtonLink>
        <ButtonLink href="/find" variant="secondary">
          Buy with a mission
        </ButtonLink>
      </div>
    </div>
  );
}
