import type { MissionId } from "@/lib/types";
import {
  hasRedis,
  redisGetJson,
  redisSetJson,
} from "@/lib/redis-kv";
import { scoreListingFit, type FitPrefs } from "@/lib/fit-score";
import type { Listing } from "@/lib/types";
import { getActiveListings } from "@/lib/listings-store";

export type LandWatch = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mission: MissionId;
  counties: string[];
  budgetMax?: number;
  acresMin?: number;
  acresMax?: number;
  notes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const REDIS_KEY = "bzl:watches";
const g = globalThis as unknown as { __bzlWatches?: LandWatch[] };

function memory(): LandWatch[] {
  if (!g.__bzlWatches) g.__bzlWatches = [];
  return g.__bzlWatches;
}

export async function readWatches(): Promise<LandWatch[]> {
  if (hasRedis()) {
    const fromRedis = await redisGetJson<LandWatch>(REDIS_KEY);
    if (fromRedis) {
      g.__bzlWatches = fromRedis;
      return fromRedis;
    }
  }
  return memory();
}

export async function writeWatches(watches: LandWatch[]): Promise<void> {
  g.__bzlWatches = watches;
  await redisSetJson(REDIS_KEY, watches);
}

export async function addWatch(
  input: Omit<LandWatch, "id" | "createdAt" | "updatedAt" | "active"> & {
    active?: boolean;
  },
): Promise<LandWatch> {
  const watches = await readWatches();
  const now = new Date().toISOString();
  const row: LandWatch = {
    id: `watch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    mission: input.mission,
    counties: input.counties || [],
    budgetMax: input.budgetMax,
    acresMin: input.acresMin,
    acresMax: input.acresMax,
    notes: input.notes?.trim() || "",
    active: input.active !== false,
    createdAt: now,
    updatedAt: now,
  };
  watches.unshift(row);
  if (watches.length > 400) watches.length = 400;
  await writeWatches(watches);
  return row;
}

export async function deleteWatch(id: string): Promise<boolean> {
  const watches = await readWatches();
  const next = watches.filter((w) => w.id !== id);
  if (next.length === watches.length) return false;
  await writeWatches(next);
  return true;
}

export function watchToPrefs(w: LandWatch): FitPrefs {
  return {
    mission: w.mission,
    budgetMax: w.budgetMax,
    acresMin: w.acresMin,
    acresMax: w.acresMax,
    counties: w.counties,
  };
}

export type DemandRow = {
  key: string;
  mission: string;
  county: string;
  watchers: number;
  avgBudget?: number;
  avgAcresMin?: number;
};

/** Aggregate active watches for admin “list here next” board. */
export async function getWatchDemand(): Promise<DemandRow[]> {
  const watches = (await readWatches()).filter((w) => w.active);
  const map = new Map<
    string,
    { mission: string; county: string; n: number; budgets: number[]; acres: number[] }
  >();

  for (const w of watches) {
    const counties = w.counties.length ? w.counties : ["(any)"];
    for (const county of counties) {
      const key = `${w.mission}|${county}`;
      const row = map.get(key) || {
        mission: w.mission,
        county,
        n: 0,
        budgets: [],
        acres: [],
      };
      row.n += 1;
      if (w.budgetMax) row.budgets.push(w.budgetMax);
      if (w.acresMin) row.acres.push(w.acresMin);
      map.set(key, row);
    }
  }

  return Array.from(map.entries())
    .map(([key, v]) => ({
      key,
      mission: v.mission,
      county: v.county,
      watchers: v.n,
      avgBudget: v.budgets.length
        ? Math.round(v.budgets.reduce((a, b) => a + b, 0) / v.budgets.length)
        : undefined,
      avgAcresMin: v.acres.length
        ? Math.round(v.acres.reduce((a, b) => a + b, 0) / v.acres.length)
        : undefined,
    }))
    .sort((a, b) => b.watchers - a.watchers);
}

/** Live inventory that matches a watch (fit >= 55). */
export async function matchListingsForWatch(
  w: LandWatch,
  listings?: Listing[],
): Promise<{ listing: Listing; score: number }[]> {
  const book = listings || (await getActiveListings());
  const prefs = watchToPrefs(w);
  return book
    .map((listing) => ({
      listing,
      score: scoreListingFit(listing, prefs).score,
    }))
    .filter((x) => x.score >= 55)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}
