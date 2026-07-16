import { readLeads } from "@/lib/leads-store";
import { getActiveListings, readListings } from "@/lib/listings-store";
import { readClosedDeals, readComps } from "@/lib/market-book-store";
import { scoreLabel } from "@/lib/scoring";
import type { Lead, MissionId } from "@/lib/types";

export interface DashboardStats {
  totalLeads: number;
  buyerLeads: number;
  sellerLeads: number;
  hotLeads: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  activeListings: number;
  pipelineValue: number;
  avgPricePerAcreBook: number;
  sourceBreakdown: { source: string; count: number }[];
  missionDemand: { mission: string; count: number }[];
  countyDemand: { county: string; count: number }[];
  demandSupplyGaps: {
    county: string;
    demand: number;
    supply: number;
    gap: number;
  }[];
  stageBreakdown: { stage: string; count: number }[];
  decisionPrompts: string[];
  listingPerformance: {
    slug: string;
    title: string;
    views: number;
    ctaClicks: number;
    conversion: number;
  }[];
  closedVolume: number;
  avgClosedPpa: number;
  compsByCounty: { county: string; avgPpa: number; n: number }[];
}

function startOfWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function countBy<T>(
  items: T[],
  keyFn: (i: T) => string,
): { key: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = keyFn(item) || "unknown";
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const leads = await readLeads();
  const allListings = await readListings();
  const active = await getActiveListings();
  const closed = await readClosedDeals();
  const comps = await readComps();
  const week = startOfWeek().getTime();
  const month = startOfMonth().getTime();

  const buyerLeads = leads.filter((l) => l.type === "buyer");
  const sellerLeads = leads.filter((l) => l.type === "seller");
  const hotLeads = leads.filter((l) => scoreLabel(l.score) === "hot").length;

  const sourceBreakdown = countBy(leads, (l) => l.source).map((x) => ({
    source: x.key,
    count: x.count,
  }));

  const missionDemand = countBy(
    buyerLeads.filter((l) => l.mission),
    (l) => l.mission as string,
  ).map((x) => ({ mission: x.key, count: x.count }));

  const countyHits: { county: string }[] = [];
  for (const l of buyerLeads) {
    for (const c of l.counties.length ? l.counties : ["unspecified"]) {
      countyHits.push({ county: c });
    }
  }
  const countyDemand = countBy(countyHits, (x) => x.county).map((x) => ({
    county: x.key,
    count: x.count,
  }));

  const supplyByCounty = countBy(active, (l) => l.county);
  const demandMap = new Map(
    countyDemand.map((c) => [c.county.toLowerCase(), c.count]),
  );
  const supplyMap = new Map(
    supplyByCounty.map((c) => [c.key.toLowerCase(), c.count]),
  );
  const allCounties = new Set([...demandMap.keys(), ...supplyMap.keys()]);
  const demandSupplyGaps = [...allCounties]
    .filter((c) => c !== "unspecified" && c !== "unknown")
    .map((county) => {
      const demand = demandMap.get(county) || 0;
      const supply = supplyMap.get(county) || 0;
      return {
        county: county.replace(/\b\w/g, (ch) => ch.toUpperCase()),
        demand,
        supply,
        gap: demand - supply,
      };
    })
    .sort((a, b) => b.gap - a.gap);

  const stageBreakdown = countBy(leads, (l) => l.stage).map((x) => ({
    stage: x.key,
    count: x.count,
  }));

  const pipelineValue = active.reduce((s, l) => s + l.price, 0);
  const avgPricePerAcreBook =
    active.length > 0
      ? active.reduce((s, l) => s + l.price / l.acres, 0) / active.length
      : 0;

  const listingPerformance = allListings
    .map((l) => ({
      slug: l.slug,
      title: l.title,
      views: l.views,
      ctaClicks: l.ctaClicks,
      conversion: l.views > 0 ? l.ctaClicks / l.views : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const closedVolume = closed.reduce((s, d) => s + d.price, 0);
  const avgClosedPpa =
    closed.length > 0
      ? closed.reduce((s, d) => s + d.pricePerAcre, 0) / closed.length
      : 0;

  const compsByCountyMap = new Map<string, { sum: number; n: number }>();
  for (const c of comps) {
    const cur = compsByCountyMap.get(c.county) || { sum: 0, n: 0 };
    cur.sum += c.pricePerAcre;
    cur.n += 1;
    compsByCountyMap.set(c.county, cur);
  }
  const compsByCounty = [...compsByCountyMap.entries()].map(([county, v]) => ({
    county,
    avgPpa: v.sum / v.n,
    n: v.n,
  }));

  const decisionPrompts = buildPrompts({
    leads,
    sellerLeads,
    buyerLeads,
    demandSupplyGaps,
    hotLeads,
    activeCount: active.length,
  });

  return {
    totalLeads: leads.length,
    buyerLeads: buyerLeads.length,
    sellerLeads: sellerLeads.length,
    hotLeads,
    leadsThisWeek: leads.filter((l) => new Date(l.createdAt).getTime() >= week)
      .length,
    leadsThisMonth: leads.filter(
      (l) => new Date(l.createdAt).getTime() >= month,
    ).length,
    activeListings: active.filter((l) => l.status === "active").length,
    pipelineValue,
    avgPricePerAcreBook,
    sourceBreakdown,
    missionDemand,
    countyDemand,
    demandSupplyGaps,
    stageBreakdown,
    decisionPrompts,
    listingPerformance,
    closedVolume,
    avgClosedPpa,
    compsByCounty,
  };
}

function buildPrompts(input: {
  leads: Lead[];
  sellerLeads: Lead[];
  buyerLeads: Lead[];
  demandSupplyGaps: {
    county: string;
    demand: number;
    supply: number;
    gap: number;
  }[];
  hotLeads: number;
  activeCount: number;
}): string[] {
  const prompts: string[] = [];

  if (input.hotLeads > 0) {
    prompts.push(
      `${input.hotLeads} hot lead(s) need same-day contact — speed-to-lead wins land deals.`,
    );
  }

  if (
    input.sellerLeads.length < input.buyerLeads.length / 2 &&
    input.buyerLeads.length >= 2
  ) {
    prompts.push(
      "Buyer demand outpaces seller leads — push Sell Land content and sphere calls this week.",
    );
  }

  const topGap = input.demandSupplyGaps.find(
    (g) => g.gap > 0 && g.supply === 0,
  );
  if (topGap) {
    prompts.push(
      `Buyers want ${topGap.county} land but you have no active listing there — prospect FSBO / sphere.`,
    );
  }

  if (input.activeCount < 1) {
    prompts.push(
      "No live listings yet — add real inventory in Admin → Listings, or book a seller appointment.",
    );
  } else if (input.activeCount < 3) {
    prompts.push(
      "Listing inventory is thin. Prioritize seller appointments — inventory fuels the whole machine.",
    );
  }

  if (input.leads.length === 0) {
    prompts.push(
      "No leads yet — share Mission Lab and Sell Land links, and post content.",
    );
  }

  const huntDemand = input.buyerLeads.filter(
    (l) => l.mission === ("hunt" as MissionId),
  ).length;
  if (huntDemand >= 2) {
    prompts.push(
      "Hunt mission is converting — film one ridge-walk Short this week when you have a hunt-tagged listing.",
    );
  }

  if (prompts.length === 0) {
    prompts.push(
      "Book looks balanced. Double down on content in your top demand county.",
    );
  }

  return prompts.slice(0, 5);
}
