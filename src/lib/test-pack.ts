/**
 * Removable test pack for full-site QA (customer + admin).
 * Everything is tagged with [TEST-PACK] so purge can find it safely.
 */

import { addLead, readLeads, writeLeads } from "@/lib/leads-store";
import {
  addListing,
  deleteListing,
  readListings,
} from "@/lib/listings-store";
import {
  addClosedDeal,
  addComp,
  readClosedDeals,
  readComps,
  writeClosedDeals,
  writeComps,
} from "@/lib/market-book-store";
import { scoreLead } from "@/lib/scoring";
import type { Lead, Listing } from "@/lib/types";
import { TEST_TAG } from "@/lib/test-tag";

export { TEST_TAG };

function hasTag(...parts: (string | undefined | null)[]): boolean {
  return parts.some((p) => typeof p === "string" && p.includes(TEST_TAG));
}

/** Catches [TEST-PACK] and older manual test titles like "TEST Pipeline…" */
export function isTestListing(l: Listing): boolean {
  if (
    hasTag(l.title, l.story, l.brandonNotes, l.slug) ||
    l.features?.some((f) => f.includes(TEST_TAG))
  ) {
    return true;
  }
  const t = l.title.toLowerCase();
  const s = l.slug.toLowerCase();
  return (
    t.startsWith("test ") ||
    t.includes("test pipeline") ||
    s.startsWith("test-") ||
    s.includes("test-pipeline")
  );
}

export function isTestLead(l: Lead): boolean {
  return (
    hasTag(l.name, l.email, l.notes, l.source, l.id) ||
    l.email.endsWith("@example.com") ||
    l.name.toLowerCase().startsWith("test ")
  );
}

export type TestPackResult = {
  listings: number;
  buyerLeads: number;
  sellerLeads: number;
  comps: number;
  closedDeals: number;
  publicPaths?: { label: string; href: string }[];
  removed?: {
    listings: number;
    leads: number;
    comps: number;
    closedDeals: number;
  };
};

export async function seedTestPack(): Promise<TestPackResult> {
  await purgeTestPack();

  // Four tracts → every Mission Lab chip + home featured + map + counties
  const hunt = await addListing({
    title: `${TEST_TAG} Hunt Ridge — 38± ac Meigs County`,
    price: 165000,
    acres: 38,
    county: "Meigs",
    lat: 39.05,
    lng: -82.0,
    addressDisplay: "Meigs County, SE Ohio (test)",
    story: `${TEST_TAG} Customer-site test listing for hunt mission. Ridge timber, food-plot openings, private feel. Safe to delete via Test Lab.`,
    brandonNotes: `${TEST_TAG} Walk notes: ridge bench, oak edge, seasonal creek (fictional).`,
    features: ["Ridge timber", "Food plot open", "County road", TEST_TAG],
    missions: ["hunt", "timber"],
    status: "active",
    accessNotes: `${TEST_TAG} Gravel lane (fictional).`,
    utilities: `${TEST_TAG} Electric nearby (fictional).`,
    wildlifeNotes: `${TEST_TAG} Deer sign on ridge (fictional).`,
    soilsSummary: `${TEST_TAG} Mixed upland (fictional).`,
  });

  const homestead = await addListing({
    title: `${TEST_TAG} Homestead Hollow — 12± ac Athens County`,
    price: 98000,
    acres: 12,
    county: "Athens",
    lat: 39.33,
    lng: -82.1,
    addressDisplay: "Athens County, SE Ohio (test)",
    story: `${TEST_TAG} Customer-site test for homestead mission. Cabin pad feel, mixed open/wood edge. Removable.`,
    brandonNotes: `${TEST_TAG} Delete anytime via Test Lab.`,
    features: ["Open edge", "Cabin site potential", TEST_TAG],
    missions: ["homestead", "farm"],
    status: "active",
    accessNotes: `${TEST_TAG} Shared driveway note (fictional).`,
    utilities: `${TEST_TAG} Well/septic TBD (fictional).`,
  });

  const farm = await addListing({
    title: `${TEST_TAG} Farm Bench — 55± ac Vinton County`,
    price: 249000,
    acres: 55,
    county: "Vinton",
    lat: 39.25,
    lng: -82.48,
    addressDisplay: "Vinton County, SE Ohio (test)",
    story: `${TEST_TAG} Customer-site test for farm mission. Open ground + wooded edge. Removable test inventory.`,
    brandonNotes: `${TEST_TAG} Fictional pasture mix for Mission Lab farm matches.`,
    features: ["Open ground", "Road frontage", TEST_TAG],
    missions: ["farm", "homestead"],
    status: "active",
    accessNotes: `${TEST_TAG} County road frontage (fictional).`,
    utilities: `${TEST_TAG} Power at road (fictional).`,
  });

  const timber = await addListing({
    title: `${TEST_TAG} Timber Stand — 80± ac Hocking County`,
    price: 320000,
    acres: 80,
    county: "Hocking",
    lat: 39.5,
    lng: -82.4,
    addressDisplay: "Hocking County, SE Ohio (test)",
    story: `${TEST_TAG} Customer-site test for timber mission. Hardwood stand, recreation potential. Removable.`,
    brandonNotes: `${TEST_TAG} Fictional timber notes for pipeline QA.`,
    features: ["Hardwood stand", "Interior trails", TEST_TAG],
    missions: ["timber", "hunt"],
    status: "active",
    accessNotes: `${TEST_TAG} Locked gate (fictional).`,
    soilsSummary: `${TEST_TAG} Forest soils (fictional).`,
  });

  // Seeded CRM samples (admin) — also prove lead types after public forms
  await addLead({
    type: "buyer",
    name: `${TEST_TAG} Buyer Hot — Alex Hunt`,
    email: "test-buyer-hot@example.com",
    phone: "740-555-0101",
    source: `${TEST_TAG} mission-lab`,
    mission: "hunt",
    counties: ["Meigs", "Athens"],
    budgetMax: 200000,
    acresMin: 20,
    timeline: "asap-30-days",
    score: scoreLead({
      type: "buyer",
      timeline: "asap-30-days",
      budgetMax: 200000,
      acresMin: 20,
      phone: "740-555-0101",
      counties: ["Meigs", "Athens"],
      mission: "hunt",
    }),
    stage: "new",
    notes: `${TEST_TAG} Sample CRM row. Also submit live forms on public site to add more.`,
  });

  await addLead({
    type: "buyer",
    name: `${TEST_TAG} Buyer Warm — Sam Home`,
    email: "test-buyer-warm@example.com",
    phone: "740-555-0102",
    source: `${TEST_TAG} contact-page`,
    mission: "homestead",
    counties: ["Athens"],
    budgetMax: 120000,
    acresMin: 10,
    timeline: "6-months",
    score: scoreLead({
      type: "buyer",
      timeline: "6-months",
      budgetMax: 120000,
      acresMin: 10,
      phone: "740-555-0102",
      counties: ["Athens"],
      mission: "homestead",
    }),
    stage: "new",
    notes: `${TEST_TAG} Sample warm buyer.`,
  });

  await addLead({
    type: "buyer",
    name: `${TEST_TAG} Listing Inquiry — Riley View`,
    email: "test-listing-inquiry@example.com",
    phone: "740-555-0103",
    source: `${TEST_TAG} listing:${hunt.slug}`,
    mission: "hunt",
    counties: ["Meigs"],
    budgetMax: 180000,
    acresMin: 30,
    timeline: "90-days",
    score: scoreLead({
      type: "buyer",
      timeline: "90-days",
      budgetMax: 180000,
      acresMin: 30,
      phone: "740-555-0103",
      counties: ["Meigs"],
      mission: "hunt",
    }),
    stage: "new",
    notes: `${TEST_TAG} Asked about ${hunt.title}.`,
  });

  await addLead({
    type: "seller",
    name: `${TEST_TAG} Seller Ready — Jordan Acre`,
    email: "test-seller-ready@example.com",
    phone: "740-555-0201",
    source: `${TEST_TAG} sell-readiness`,
    counties: ["Vinton"],
    timeline: "asap-30-days",
    score: scoreLead({
      type: "seller",
      timeline: "asap-30-days",
      phone: "740-555-0201",
      readinessScore: 85,
    }),
    stage: "new",
    notes: `${TEST_TAG} Sample high-readiness seller. Also test live /sell form.`,
    readinessScore: 85,
  });

  await addLead({
    type: "seller",
    name: `${TEST_TAG} Seller Cool — Pat Future`,
    email: "test-seller-cool@example.com",
    source: `${TEST_TAG} sell-page`,
    counties: ["Hocking"],
    timeline: "1-year-plus",
    score: scoreLead({
      type: "seller",
      timeline: "1-year-plus",
      readinessScore: 30,
    }),
    stage: "new",
    notes: `${TEST_TAG} Sample long-horizon seller.`,
    readinessScore: 30,
  });

  await addComp({
    county: "Meigs",
    acres: 40,
    price: 160000,
    saleDate: "2025-11-15",
    landType: "hunt / timber",
    sourceNote: `${TEST_TAG} Sample comp — not a real sale.`,
  });
  await addComp({
    county: "Athens",
    acres: 15,
    price: 105000,
    saleDate: "2026-02-01",
    landType: "homestead",
    sourceNote: `${TEST_TAG} Sample comp — removable.`,
  });
  await addClosedDeal({
    county: "Hocking",
    acres: 28,
    price: 140000,
    landType: "mixed",
    closedAt: "2026-01-20",
    side: "list",
    notes: `${TEST_TAG} Fake closed deal for KPIs. Safe to delete.`,
  });

  const publicPaths = [
    { label: "Home (featured listings)", href: "/" },
    { label: "Buy — Mission Lab", href: "/find" },
    { label: "Mission: Hunt matches", href: "/find?mission=hunt" },
    { label: "Mission: Farm matches", href: "/find?mission=farm" },
    { label: "Mission: Homestead matches", href: "/find?mission=homestead" },
    { label: "Mission: Timber matches", href: "/find?mission=timber" },
    { label: "All listings", href: "/listings" },
    { label: "Dossier — Hunt Ridge", href: `/listings/${hunt.slug}` },
    { label: "Dossier — Homestead Hollow", href: `/listings/${homestead.slug}` },
    { label: "Dossier — Farm Bench", href: `/listings/${farm.slug}` },
    { label: "Dossier — Timber Stand", href: `/listings/${timber.slug}` },
    { label: "Land IQ map (pins)", href: "/map" },
    { label: "County — Meigs", href: "/counties/meigs" },
    { label: "County — Athens", href: "/counties/athens" },
    { label: "County — Vinton", href: "/counties/vinton" },
    { label: "County — Hocking", href: "/counties/hocking" },
    { label: "Sell land (readiness + form)", href: "/sell" },
    { label: "Contact form", href: "/contact" },
    { label: "How we work", href: "/how-we-work" },
    { label: "About", href: "/about" },
  ];

  return {
    listings: 4,
    buyerLeads: 3,
    sellerLeads: 2,
    comps: 2,
    closedDeals: 1,
    publicPaths,
  };
}

export async function purgeTestPack(): Promise<TestPackResult> {
  const listings = await readListings();
  let removedListings = 0;
  for (const l of listings) {
    if (isTestListing(l)) {
      await deleteListing(l.id);
      removedListings += 1;
    }
  }

  const leads = await readLeads();
  const keptLeads = leads.filter((l) => !isTestLead(l));
  const removedLeads = leads.length - keptLeads.length;
  if (removedLeads > 0) await writeLeads(keptLeads);

  const comps = await readComps();
  const keptComps = comps.filter((c) => !hasTag(c.sourceNote, c.landType));
  const removedComps = comps.length - keptComps.length;
  if (removedComps > 0) await writeComps(keptComps);

  const closed = await readClosedDeals();
  const keptClosed = closed.filter((d) => !hasTag(d.notes, d.landType));
  const removedClosed = closed.length - keptClosed.length;
  if (removedClosed > 0) await writeClosedDeals(keptClosed);

  return {
    listings: 0,
    buyerLeads: 0,
    sellerLeads: 0,
    comps: 0,
    closedDeals: 0,
    removed: {
      listings: removedListings,
      leads: removedLeads,
      comps: removedComps,
      closedDeals: removedClosed,
    },
  };
}

export async function countTestPack(): Promise<{
  listings: number;
  leads: number;
  comps: number;
  closedDeals: number;
}> {
  const listings = await readListings();
  const leads = await readLeads();
  const comps = await readComps();
  const closed = await readClosedDeals();
  return {
    listings: listings.filter(isTestListing).length,
    leads: leads.filter(isTestLead).length,
    comps: comps.filter((c) => hasTag(c.sourceNote)).length,
    closedDeals: closed.filter((d) => hasTag(d.notes)).length,
  };
}

export async function getCustomerWalkthroughLinks(): Promise<
  { label: string; href: string; group: string }[]
> {
  const listings = (await readListings()).filter(isTestListing);

  const links: { label: string; href: string; group: string }[] = [
    { group: "Start", label: "Home — featured tracts", href: "/" },
    { group: "Buy", label: "Mission Lab (pick a mission)", href: "/find" },
    { group: "Buy", label: "Hunt matches", href: "/find?mission=hunt" },
    { group: "Buy", label: "Farm matches", href: "/find?mission=farm" },
    { group: "Buy", label: "Homestead matches", href: "/find?mission=homestead" },
    { group: "Buy", label: "Timber matches", href: "/find?mission=timber" },
    { group: "Inventory", label: "All land for sale", href: "/listings" },
  ];

  for (const l of listings) {
    links.push({
      group: "Dossiers",
      label: l.title.replace(`${TEST_TAG} `, ""),
      href: `/listings/${l.slug}`,
    });
  }

  links.push(
    { group: "Map", label: "Land IQ map (listing pins)", href: "/map" },
    { group: "Counties", label: "Meigs County page", href: "/counties/meigs" },
    { group: "Counties", label: "Athens County page", href: "/counties/athens" },
    { group: "Counties", label: "Vinton County page", href: "/counties/vinton" },
    { group: "Counties", label: "Hocking County page", href: "/counties/hocking" },
    { group: "Sell", label: "Sell — readiness score + form", href: "/sell" },
    { group: "Contact", label: "Contact form", href: "/contact" },
    { group: "Info", label: "How we work", href: "/how-we-work" },
    { group: "Info", label: "About Brandon", href: "/about" },
  );

  // silence unused if empty pack
  void byMission;
  return links;
}
