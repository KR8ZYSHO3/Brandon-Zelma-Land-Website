import type { Listing } from "@/lib/types";

/** Seed / demo listings — replace with Brandon’s live book via admin. */
export const LISTINGS: Listing[] = [
  {
    id: "lst-001",
    slug: "vinton-ridge-woodlot-42",
    status: "active",
    title: "42± Acres Ridge Woodlot — Vinton County",
    price: 189000,
    acres: 42,
    county: "Vinton",
    lat: 39.28,
    lng: -82.52,
    addressDisplay: "Near McArthur, OH (location shared after inquiry)",
    story:
      "A classic Southeast Ohio ridge tract — mixed hardwoods, interior trails, and enough seclusion that you’ll hear the wind before you hear traffic. This is the kind of ground Brandon walks fence line by fence line: where the deer bed, where water holds, and where a cabin pad might sit without fighting the grade.",
    brandonNotes:
      "Walked the north boundary and the hollow drain. Timber is mixed oak/hickory with some grapevine — not a clear-cut story, more of a long-term hold with solid hunt character. Access is deeded off a township road; 4WD helps after hard rain. I’d market this hard to hunt + timber buyers out of Columbus and Cincinnati.",
    features: [
      "Mixed hardwood timber",
      "Interior trails",
      "Deed access",
      "Secluded ridge setting",
      "Wildlife sign throughout",
    ],
    missions: ["hunt", "timber", "homestead"],
    media: [],
    publishedAt: "2026-06-01T12:00:00Z",
    views: 128,
    ctaClicks: 14,
    accessNotes: "Township road frontage; gravel lane. Confirm gate code at showing.",
    utilities: "Electric at road (verify hookup). No public water/sewer — typical rural.",
    soilsSummary: "Upland soils; better suited to woods/recreation than row crop.",
    floodNote: "Primary ridge sits well above floodplain of the drain.",
    wildlifeNotes: "Whitetail sign, turkey dusting areas noted on walk.",
  },
  {
    id: "lst-002",
    slug: "athens-hobby-farm-18",
    status: "active",
    title: "18± Acre Hobby Farm Setup — Athens County",
    price: 245000,
    acres: 18,
    county: "Athens",
    lat: 39.35,
    lng: -82.15,
    addressDisplay: "Athens County, OH",
    story:
      "Open pasture mixed with a wooded back corner — the kind of place that works for a few head of cattle, a big garden, or a weekend escape that still feels like real country. Close enough to Athens amenities that daily life is practical.",
    brandonNotes:
      "Fencing needs a season of maintenance on the west line. Pond is a feature if stocked and maintained. I’d pitch homestead + light farm buyers, not pure timber investors.",
    features: ["Pasture", "Pond", "Road frontage", "Outbuilding site", "Mixed open/woods"],
    missions: ["farm", "homestead"],
    media: [],
    publishedAt: "2026-05-15T12:00:00Z",
    views: 96,
    ctaClicks: 11,
    accessNotes: "County road frontage.",
    utilities: "Electric available. Well/septic needed for residence.",
    soilsSummary: "Mixed: open areas more farmable; woods on steeper back slope.",
    floodNote: "Low corner near pond can hold water after storms — plan pad locations carefully.",
    wildlifeNotes: "Edge habitat for small game; deer travel the wooded line.",
  },
  {
    id: "lst-003",
    slug: "hocking-cabin-site-12",
    status: "active",
    title: "12± Acres Cabin Site Near Hocking Hills",
    price: 129000,
    acres: 12,
    county: "Hocking",
    lat: 39.48,
    lng: -82.48,
    addressDisplay: "Hocking County, OH",
    story:
      "A manageable acreage play for someone who wants the Hocking Hills lifestyle without managing a hundred-acre timber operation. Wooded privacy, buildable feel, and recreation on the doorstep.",
    brandonNotes:
      "Check HOA/covenants if any subdivision remnants apply. Perc test recommended before underwriting a cabin dream. Strong short-term rental interest in the region — buyers should verify local rules.",
    features: ["Cabin potential", "Wooded privacy", "Recreation access region", "Manageable size"],
    missions: ["homestead", "hunt"],
    media: [],
    publishedAt: "2026-06-20T12:00:00Z",
    views: 210,
    ctaClicks: 28,
    accessNotes: "Shared or private drive — confirm easement language in title work.",
    utilities: "Electric nearby. Well/septic for build.",
    soilsSummary: "Typical Hocking upland; buildability needs site-specific check.",
    floodNote: "No mapped issues on the ridge pad area from preliminary look.",
    wildlifeNotes: "Suburban-edge wildlife pressure varies by neighbor activity.",
  },
  {
    id: "lst-004",
    slug: "ross-bottom-farm-65",
    status: "active",
    title: "65± Acres Mixed Farm & Timber — Ross County",
    price: 389000,
    acres: 65,
    county: "Ross",
    lat: 39.3,
    lng: -83.05,
    addressDisplay: "Ross County, OH",
    story:
      "Bigger tract energy: open ground up front, timber and contour in the back. Works for a serious hobby farmer, a land investor who wants optionality, or a family that wants room to grow into the property over decades.",
    brandonNotes:
      "I’d run dual marketing: farm buyers on the open acres and hunt/timber on the back forty. Soil maps and a quick timber walk should be in every showing packet.",
    features: [
      "Mixed use",
      "Road frontage",
      "Tillable / pasture potential",
      "Timber block",
      "Scale for investment",
    ],
    missions: ["farm", "timber", "hunt"],
    media: [],
    publishedAt: "2026-04-10T12:00:00Z",
    views: 175,
    ctaClicks: 19,
    accessNotes: "Multiple access points — confirm which is deeded primary.",
    utilities: "Electric at road. Rural services typical.",
    soilsSummary: "Better soils on open frontage; upland timber soils on rear.",
    floodNote: "Check low field edge after heavy rain events.",
    wildlifeNotes: "Strong edge effect between crop/open and timber.",
  },
  {
    id: "lst-005",
    slug: "meigs-river-hills-28",
    status: "pending",
    title: "28± Acres River Hills — Meigs County",
    price: 165000,
    acres: 28,
    county: "Meigs",
    lat: 39.05,
    lng: -81.98,
    addressDisplay: "Meigs County, OH",
    story:
      "Hills that roll toward river country — recreational first, with enough timber character to hold value. Pending offer; still showcasing the dossier style for the book.",
    brandonNotes:
      "Under contract as of last update. Keep as proof of process and for similar-buyer lead matching.",
    features: ["Hill country", "Timber", "Recreational", "Under contract"],
    missions: ["hunt", "timber"],
    media: [],
    publishedAt: "2026-03-01T12:00:00Z",
    views: 88,
    ctaClicks: 9,
    accessNotes: "Steep sections — walk before you drive equipment.",
    utilities: "Limited; plan off-grid or long pull.",
    soilsSummary: "Steep upland soils.",
    floodNote: "Lower draws can run hard after storms.",
    wildlifeNotes: "Good cover; pressure depends on surrounding tracts.",
  },
];

export function getActiveListings(): Listing[] {
  return LISTINGS.filter((l) => l.status === "active" || l.status === "pending");
}

export function getListingBySlug(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

export function getListingsByCounty(countyName: string): Listing[] {
  return getActiveListings().filter(
    (l) => l.county.toLowerCase() === countyName.toLowerCase(),
  );
}

export function getListingsByMission(mission: string): Listing[] {
  return getActiveListings().filter((l) =>
    l.missions.includes(mission as Listing["missions"][number]),
  );
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pricePerAcre(listing: Listing): number {
  return listing.acres > 0 ? listing.price / listing.acres : 0;
}
