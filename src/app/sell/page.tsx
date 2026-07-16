import type { Metadata } from "next";
import { SellReadiness } from "./SellReadiness";

export const metadata: Metadata = {
  title: "Sell Your Land",
  description:
    "Land Sale Readiness Score and seller strategy with Brandon Zelma, Southeast Ohio Land Pro, Buckeye Land Sales.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Sell land in Southeast Ohio
      </h1>
      <p className="mt-3 text-muted leading-relaxed">
        Listings fuel everything. If you own acreage and you&apos;re thinking
        about selling, start with a honest readiness score — then talk strategy
        with someone who walks fence lines for a living.
      </p>
      <p className="mt-2 text-sm text-muted">
        Brandon Zelma · Land Pro with{" "}
        <strong className="text-forest">Buckeye Land Sales</strong>
      </p>
      <div className="mt-10">
        <SellReadiness />
      </div>
    </div>
  );
}
