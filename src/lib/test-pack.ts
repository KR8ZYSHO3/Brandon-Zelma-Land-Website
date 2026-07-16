/**
 * Removable test pack for pipeline QA.
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
import type { Lead } from "@/lib/types";
import { TEST_TAG } from "@/lib/test-tag";

export { TEST_TAG };

function hasTag(...parts: (string | undefined | null)[]): boolean {
  return parts.some((p) => typeof p === "string" && p.includes(TEST_TAG));
}

export function isTestLead(l: Lead): boolean {
  return hasTag(l.name, l.email, l.notes, l.source, l.id);
}

export type TestPackResult = {
  listings: number;
  buyerLeads: number;
  sellerLeads: number;
  comps: number;
  closedDeals: number;
  removed?: {
    listings: number;
    leads: number;
    comps: number;
    closedDeals: number;
  };
};

export async function seedTestPack(): Promise<TestPackResult> {
  // Avoid stacking duplicates: purge first
  await purgeTestPack();

  const listingA = await addListing({
    title: `${TEST_TAG} Hunt Ridge — 38± ac Meigs County`,
    price: 165000,
    acres: 38,
    county: "Meigs",
    lat: 39.05,
    lng: -82.0,
    addressDisplay: "Meigs County, SE Ohio (test)",
    story: `${TEST_TAG} Pipeline test listing. Ridge timber, food-plot openings, private feel. Delete from Admin → Listings or Test Lab.`,
    brandonNotes: `${TEST_TAG} Safe to delete. Used for map, Mission Lab, and dossier form tests.`,
    features: ["Ridge timber", "Food plot open", "County road", TEST_TAG],
    missions: ["hunt", "timber"],
    status: "active",
    accessNotes: `${TEST_TAG} Gravel lane (fictional).`,
    utilities: `${TEST_TAG} Electric nearby (fictional).`,
  });

  const listingB = await addListing({
    title: `${TEST_TAG} Homestead Hollow — 12± ac Athens County`,
    price: 98000,
    acres: 12,
    county: "Athens",
    lat: 39.33,
    lng: -82.1,
    addressDisplay: "Athens County, SE Ohio (test)",
    story: `${TEST_TAG} Smaller tract for homestead mission matching. Mixed open/wood edge. Removable test inventory.`,
    brandonNotes: `${TEST_TAG} Delete anytime via Test Lab or Listings.`,
    features: ["Open edge", "Cabin site potential", TEST_TAG],
    missions: ["homestead", "farm"],
    status: "active",
    accessNotes: `${TEST_TAG} Shared driveway note (fictional).`,
    utilities: `${TEST_TAG} Well/septic TBD (fictional).`,
  });

  const buyerHot = scoreLead({
    type: "buyer",
    timeline: "asap-30-days",
    budgetMax: 200000,
    acresMin: 20,
    phone: "740-555-0101",
    counties: ["Meigs", "Athens"],
    mission: "hunt",
  });
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
    score: buyerHot,
    stage: "new",
    notes: `${TEST_TAG} Hot buyer for Mission Lab / speed-to-lead. Match listing ${listingA.slug}.`,
  });

  const buyerWarm = scoreLead({
    type: "buyer",
    timeline: "6-months",
    budgetMax: 120000,
    acresMin: 10,
    phone: "740-555-0102",
    counties: ["Athens"],
    mission: "homestead",
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
    score: buyerWarm,
    stage: "new",
    notes: `${TEST_TAG} Warm homestead buyer. Match listing ${listingB.slug}.`,
  });

  const sellerReady = scoreLead({
    type: "seller",
    timeline: "asap-30-days",
    phone: "740-555-0201",
    readinessScore: 85,
  });
  await addLead({
    type: "seller",
    name: `${TEST_TAG} Seller Ready — Jordan Acre`,
    email: "test-seller-ready@example.com",
    phone: "740-555-0201",
    source: `${TEST_TAG} sell-readiness`,
    counties: ["Vinton"],
    timeline: "asap-30-days",
    score: sellerReady,
    stage: "new",
    notes: `${TEST_TAG} High readiness seller. 55 ac Vinton, wants list strategy.`,
    readinessScore: 85,
  });

  const sellerCool = scoreLead({
    type: "seller",
    timeline: "1-year-plus",
    phone: undefined,
    readinessScore: 30,
  });
  await addLead({
    type: "seller",
    name: `${TEST_TAG} Seller Cool — Pat Future`,
    email: "test-seller-cool@example.com",
    source: `${TEST_TAG} sell-page`,
    counties: ["Hocking"],
    timeline: "1-year-plus",
    score: sellerCool,
    stage: "new",
    notes: `${TEST_TAG} Long-horizon seller. Nurture only.`,
    readinessScore: 30,
  });

  // Listing inquiry style lead
  await addLead({
    type: "buyer",
    name: `${TEST_TAG} Listing Inquiry — Riley View`,
    email: "test-listing-inquiry@example.com",
    phone: "740-555-0103",
    source: `${TEST_TAG} listing:${listingA.slug}`,
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
    notes: `${TEST_TAG} Asked about ${listingA.title}.`,
  });

  await addComp({
    county: "Meigs",
    acres: 40,
    price: 160000,
    saleDate: "2025-11-15",
    landType: "hunt / timber",
    sourceNote: `${TEST_TAG} Sample comp — not a real sale. Delete in Market or Test Lab.`,
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
    notes: `${TEST_TAG} Fake closed deal for Command / Market KPIs. Safe to delete.`,
  });

  return {
    listings: 2,
    buyerLeads: 3,
    sellerLeads: 2,
    comps: 2,
    closedDeals: 1,
  };
}

export async function purgeTestPack(): Promise<TestPackResult> {
  const listings = await readListings();
  let removedListings = 0;
  for (const l of listings) {
    if (
      hasTag(l.title, l.story, l.brandonNotes, l.slug) ||
      l.features?.some((f) => f.includes(TEST_TAG))
    ) {
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
    listings: listings.filter(
      (l) =>
        hasTag(l.title, l.story, l.brandonNotes) ||
        l.features?.some((f) => f.includes(TEST_TAG)),
    ).length,
    leads: leads.filter(isTestLead).length,
    comps: comps.filter((c) => hasTag(c.sourceNote)).length,
    closedDeals: closed.filter((d) => hasTag(d.notes)).length,
  };
}
