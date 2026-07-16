/**
 * Market comps & closed deals are live via market-book-store (Admin → Market).
 * No seed data — only what Brandon logs.
 */
export {
  readComps,
  addComp,
  readClosedDeals,
  addClosedDeal,
} from "@/lib/market-book-store";

/** Educational only — links to public USDA data, not fake comps */
export const USDA_CONTEXT = {
  title: "Ohio farm real estate context (educational)",
  source: "USDA NASS Land Values",
  asOf: "2025",
  notes: [
    "Statewide cropland and farm real estate indexes lag and weight agricultural use heavily.",
    "SE Ohio recreational and timber tracts often price differently than western Ohio cropland.",
    "Use your own comps + boots-on-ground for listing strategy.",
  ],
  metrics: [
    {
      label: "Ohio farm real estate (context)",
      value: "See USDA Quick Stats for latest $/acre",
    },
    {
      label: "How to use",
      value:
        "Compare direction of travel year-over-year, not absolute recreational pricing",
    },
  ],
};
