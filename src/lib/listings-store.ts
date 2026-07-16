import type { Listing, ListingStatus, MissionId } from "@/lib/types";
import {
  hasRedis,
  redisGetJson,
  redisSetJson,
  storageLabel,
  storageMode,
  type DurableStorageMode,
} from "@/lib/redis-kv";

/**
 * Live listing inventory — Admin → Listings.
 * 1. Upstash Redis (same DB as leads — no second database)
 * 2. Local data/listings.json
 * 3. In-memory (unreliable on Vercel)
 */

const REDIS_KEY = "bzl:listings";
const globalStore = globalThis as unknown as { __bzlListings?: Listing[] };

export type ListingsStorageMode = DurableStorageMode;

function canUseFs(): boolean {
  return process.env.VERCEL !== "1" && process.env.USE_MEMORY_LISTINGS !== "1";
}

export function getListingsStorageMode(): ListingsStorageMode {
  return storageMode(canUseFs());
}

export function getListingsStorageLabel(): string {
  return storageLabel(getListingsStorageMode(), "data/listings.json");
}

export function listingsAreDurable(): boolean {
  return getListingsStorageMode() !== "memory";
}

function memory(): Listing[] {
  if (!globalStore.__bzlListings) globalStore.__bzlListings = [];
  return globalStore.__bzlListings;
}

async function readFromFs(): Promise<Listing[] | null> {
  if (!canUseFs()) return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const file = path.join(process.cwd(), "data", "listings.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Listing[];
  } catch {
    return null;
  }
}

async function writeToFs(listings: Listing[]): Promise<void> {
  if (!canUseFs()) return;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "listings.json"),
      JSON.stringify(listings, null, 2),
      "utf8",
    );
  } catch {
    /* ignore */
  }
}

export async function readListings(): Promise<Listing[]> {
  if (hasRedis()) {
    const fromRedis = await redisGetJson<Listing>(REDIS_KEY);
    if (fromRedis) {
      globalStore.__bzlListings = fromRedis;
      return fromRedis;
    }
  }

  const fromDisk = await readFromFs();
  if (fromDisk) {
    globalStore.__bzlListings = fromDisk;
    return fromDisk;
  }

  return memory();
}

export async function writeListings(listings: Listing[]): Promise<void> {
  globalStore.__bzlListings = listings;
  const ok = await redisSetJson(REDIS_KEY, listings);
  if (!ok) await writeToFs(listings);
}

export async function getActiveListings(): Promise<Listing[]> {
  const all = await readListings();
  return all.filter((l) => l.status === "active" || l.status === "pending");
}

export async function getListingBySlug(
  slug: string,
): Promise<Listing | undefined> {
  const all = await readListings();
  return all.find((l) => l.slug === slug);
}

export async function getListingsByCounty(
  countyName: string,
): Promise<Listing[]> {
  const active = await getActiveListings();
  return active.filter(
    (l) => l.county.toLowerCase() === countyName.toLowerCase(),
  );
}

export async function getListingsByMission(
  mission: string,
): Promise<Listing[]> {
  const active = await getActiveListings();
  return active.filter((l) => l.missions.includes(mission as MissionId));
}

export { formatPrice, pricePerAcre } from "@/lib/format";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export type ListingInput = {
  title: string;
  price: number;
  acres: number;
  county: string;
  lat: number;
  lng: number;
  addressDisplay?: string;
  story?: string;
  brandonNotes?: string;
  features?: string[];
  missions?: MissionId[];
  status?: ListingStatus;
  accessNotes?: string;
  utilities?: string;
  soilsSummary?: string;
  floodNote?: string;
  wildlifeNotes?: string;
  videoUrl?: string;
  slug?: string;
};

export async function addListing(input: ListingInput): Promise<Listing> {
  const listings = await readListings();
  let slug = input.slug || slugify(input.title);
  if (listings.some((l) => l.slug === slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  const listing: Listing = {
    id: `lst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug,
    status: input.status || "active",
    title: input.title.trim(),
    price: Number(input.price),
    acres: Number(input.acres),
    county: input.county.trim(),
    lat: Number(input.lat),
    lng: Number(input.lng),
    addressDisplay: input.addressDisplay?.trim() || `${input.county} area`,
    story: input.story?.trim() || "",
    brandonNotes: input.brandonNotes?.trim() || "",
    features: input.features || [],
    missions: input.missions?.length
      ? input.missions
      : (["homestead"] as MissionId[]),
    media: [],
    videoUrl: input.videoUrl,
    publishedAt: new Date().toISOString(),
    views: 0,
    ctaClicks: 0,
    accessNotes: input.accessNotes,
    utilities: input.utilities,
    soilsSummary: input.soilsSummary,
    floodNote: input.floodNote,
    wildlifeNotes: input.wildlifeNotes,
  };
  listings.unshift(listing);
  await writeListings(listings);
  return listing;
}

export async function updateListing(
  id: string,
  patch: Partial<ListingInput> & { status?: ListingStatus },
): Promise<Listing | null> {
  const listings = await readListings();
  const idx = listings.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  const prev = listings[idx];
  listings[idx] = {
    ...prev,
    ...patch,
    id: prev.id,
    slug: patch.slug || prev.slug,
    price: patch.price !== undefined ? Number(patch.price) : prev.price,
    acres: patch.acres !== undefined ? Number(patch.acres) : prev.acres,
    lat: patch.lat !== undefined ? Number(patch.lat) : prev.lat,
    lng: patch.lng !== undefined ? Number(patch.lng) : prev.lng,
    publishedAt: prev.publishedAt,
    views: prev.views,
    ctaClicks: prev.ctaClicks,
    media: prev.media,
  };
  await writeListings(listings);
  return listings[idx];
}

export async function deleteListing(id: string): Promise<boolean> {
  const listings = await readListings();
  const next = listings.filter((l) => l.id !== id);
  if (next.length === listings.length) return false;
  await writeListings(next);
  return true;
}
