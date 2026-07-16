export type MissionId = "hunt" | "farm" | "homestead" | "timber";

export type LeadType = "buyer" | "seller";

export type LeadStage =
  | "new"
  | "contacted"
  | "nurture"
  | "appointment"
  | "showing"
  | "offer"
  | "closed"
  | "lost";

export type ListingStatus = "draft" | "active" | "pending" | "sold" | "withdrawn";

export interface Listing {
  id: string;
  slug: string;
  status: ListingStatus;
  title: string;
  price: number;
  acres: number;
  county: string;
  lat: number;
  lng: number;
  addressDisplay: string;
  story: string;
  brandonNotes: string;
  features: string[];
  missions: MissionId[];
  media: string[];
  videoUrl?: string;
  publishedAt: string;
  views: number;
  ctaClicks: number;
  accessNotes?: string;
  utilities?: string;
  soilsSummary?: string;
  floodNote?: string;
  wildlifeNotes?: string;
}

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  source: string;
  mission?: MissionId;
  counties: string[];
  budgetMin?: number;
  budgetMax?: number;
  acresMin?: number;
  acresMax?: number;
  timeline?: string;
  score: number;
  stage: LeadStage;
  notes: string;
  readinessScore?: number;
  payload?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MarketComp {
  id: string;
  county: string;
  acres: number;
  price: number;
  pricePerAcre: number;
  saleDate: string;
  landType: string;
  sourceNote: string;
  createdAt: string;
}

export interface ClosedDeal {
  id: string;
  county: string;
  acres: number;
  price: number;
  pricePerAcre: number;
  landType: string;
  closedAt: string;
  side: "list" | "buy" | "dual";
  notes: string;
}

export interface BizDevMilestone {
  id: string;
  category: "va" | "sba" | "ohio-license" | "entity" | "operations";
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "done" | "na";
  dueDate?: string;
  notes: string;
  resourceUrl?: string;
}

export interface CountyPage {
  slug: string;
  name: string;
  blurb: string;
  lat: number;
  lng: number;
  /** State code e.g. OH, WV, KY */
  state?: string;
  /** When false, hidden from map, forms, SEO county list */
  active?: boolean;
}

/** Admin-managed service area for map + marketing coverage */
export interface ServiceAreaConfig {
  /** Label on the public map, e.g. "Southeast Ohio" or "Ohio + neighbors" */
  regionLabel: string;
  /** Short blurb under the map */
  regionBlurb: string;
  markets: MarketArea[];
  updatedAt?: string;
}

export interface MarketArea extends CountyPage {
  state: string;
  active: boolean;
}

export const MISSIONS: {
  id: MissionId;
  label: string;
  short: string;
  description: string;
}[] = [
  {
    id: "hunt",
    label: "Hunt & Recreate",
    short: "Hunt",
    description: "Whitetail, turkey, weekends in the woods — tracts that hold wildlife and access.",
  },
  {
    id: "farm",
    label: "Farm & Pasture",
    short: "Farm",
    description: "Working ground, hay, cattle, or multi-use agricultural land.",
  },
  {
    id: "homestead",
    label: "Homestead & Cabin",
    short: "Homestead",
    description: "Cabin sites, acreage living, raise kids on land, escape the city.",
  },
  {
    id: "timber",
    label: "Timber & Hold",
    short: "Timber",
    description: "Woodlots, long-term hold, timber value, and investment tracts.",
  },
];

/**
 * @deprecated Prefer getActiveMarkets() from markets-store for live coverage.
 * Kept as SE Ohio defaults for static fallbacks.
 */
export const FOCUS_COUNTIES: CountyPage[] = [
  {
    slug: "athens",
    name: "Athens County",
    blurb: "Hocking foothills energy, university town access, and diverse recreational land.",
    lat: 39.3292,
    lng: -82.1013,
  },
  {
    slug: "vinton",
    name: "Vinton County",
    blurb: "One of Ohio’s most rural counties — timber, hills, and serious hunting ground.",
    lat: 39.2509,
    lng: -82.4857,
  },
  {
    slug: "hocking",
    name: "Hocking County",
    blurb: "Hocking Hills recreation draw with cabin and acreage demand year-round.",
    lat: 39.4953,
    lng: -82.5,
  },
  {
    slug: "meigs",
    name: "Meigs County",
    blurb: "Ohio River country with farms, hollows, and recreational tracts.",
    lat: 39.0723,
    lng: -82.0307,
  },
  {
    slug: "morgan",
    name: "Morgan County",
    blurb: "Quiet country living with mixed farm and wooded acreage.",
    lat: 39.6206,
    lng: -81.8527,
  },
  {
    slug: "perry",
    name: "Perry County",
    blurb: "Rolling terrain between Columbus reach and deep SE Ohio woods.",
    lat: 39.7351,
    lng: -82.236,
  },
  {
    slug: "jackson",
    name: "Jackson County",
    blurb: "Hills, lakes access, and a strong market for recreational land.",
    lat: 39.052,
    lng: -82.6366,
  },
  {
    slug: "ross",
    name: "Ross County",
    blurb: "Chillicothe hub with farms, river bottom, and larger tracts.",
    lat: 39.3334,
    lng: -83.0,
  },
];
