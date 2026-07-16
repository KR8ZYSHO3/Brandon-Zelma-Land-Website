import type { ClosedDeal, MarketComp } from "@/lib/types";

/** Comparable sales Brandon logs over time — starts empty. */
export const MARKET_COMPS: MarketComp[] = [];

/** Closed sides for his book analytics — starts empty. */
export const CLOSED_DEALS: ClosedDeal[] = [];

/** Educational macro context — not an appraisal. Refresh from USDA NASS periodically. */
export const USDA_CONTEXT = {
  title: "Ohio farm real estate context (educational)",
  source: "USDA NASS Land Values",
  asOf: "2025",
  notes: [
    "Statewide cropland and farm real estate indexes lag and weight agricultural use heavily.",
    "SE Ohio recreational and timber tracts often price differently than western Ohio cropland.",
    "Use internal comps + boots-on-ground for listing strategy; treat macro charts as climate, not GPS.",
  ],
  metrics: [
    {
      label: "Ohio farm real estate (context)",
      value: "See USDA Quick Stats for latest $/acre",
    },
    {
      label: "How to use",
      value:
        "Compare direction of travel year-over-year, not absolute SE recreational pricing",
    },
  ],
};
