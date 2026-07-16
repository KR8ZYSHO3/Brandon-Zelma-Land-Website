import type { ClosedDeal, MarketComp } from "@/lib/types";

/** Sample comps Brandon can replace with real courthouse/MLS knowledge. */
export const MARKET_COMPS: MarketComp[] = [
  {
    id: "cmp-1",
    county: "Vinton",
    acres: 40,
    price: 160000,
    pricePerAcre: 4000,
    saleDate: "2025-11-12",
    landType: "hunt/timber",
    sourceNote: "Local closed sale (demo data)",
    createdAt: "2026-01-05T12:00:00Z",
  },
  {
    id: "cmp-2",
    county: "Athens",
    acres: 20,
    price: 220000,
    pricePerAcre: 11000,
    saleDate: "2025-09-03",
    landType: "homestead/farm",
    sourceNote: "Local closed sale (demo data)",
    createdAt: "2026-01-05T12:00:00Z",
  },
  {
    id: "cmp-3",
    county: "Hocking",
    acres: 10,
    price: 115000,
    pricePerAcre: 11500,
    saleDate: "2026-01-20",
    landType: "cabin site",
    sourceNote: "Local closed sale (demo data)",
    createdAt: "2026-02-01T12:00:00Z",
  },
  {
    id: "cmp-4",
    county: "Ross",
    acres: 80,
    price: 480000,
    pricePerAcre: 6000,
    saleDate: "2025-08-15",
    landType: "farm/timber mix",
    sourceNote: "Local closed sale (demo data)",
    createdAt: "2026-01-10T12:00:00Z",
  },
];

export const CLOSED_DEALS: ClosedDeal[] = [
  {
    id: "cd-1",
    county: "Vinton",
    acres: 35,
    price: 155000,
    pricePerAcre: 4429,
    landType: "hunt",
    closedAt: "2025-10-01",
    side: "list",
    notes: "Demo closed deal for dashboard math",
  },
  {
    id: "cd-2",
    county: "Athens",
    acres: 15,
    price: 198000,
    pricePerAcre: 13200,
    landType: "homestead",
    closedAt: "2026-02-14",
    side: "dual",
    notes: "Demo dual-side",
  },
];

/** Educational macro context — not an appraisal. Refresh from USDA NASS periodically. */
export const USDA_CONTEXT = {
  title: "Ohio farm real estate context (educational)",
  source: "USDA NASS Land Values (illustrative cached snapshot)",
  asOf: "2025",
  notes: [
    "Statewide cropland and farm real estate indexes lag and weight agricultural use heavily.",
    "SE Ohio recreational and timber tracts often price differently than western Ohio cropland.",
    "Use internal comps + boots-on-ground for listing strategy; treat macro charts as climate, not GPS.",
  ],
  metrics: [
    { label: "Ohio farm real estate (context)", value: "See USDA Quick Stats for latest $/acre" },
    { label: "How to use", value: "Compare direction of travel year-over-year, not absolute SE recreational pricing" },
  ],
};
