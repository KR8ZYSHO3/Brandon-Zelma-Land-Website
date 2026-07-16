import type { ClosedDeal, MarketComp } from "@/lib/types";
import {
  hasRedis,
  redisGetJson,
  redisSetJson,
  storageLabel,
  storageMode,
  type DurableStorageMode,
} from "@/lib/redis-kv";

const COMPS_KEY = "bzl:comps";
const CLOSED_KEY = "bzl:closed";

const g = globalThis as unknown as {
  __bzlComps?: MarketComp[];
  __bzlClosed?: ClosedDeal[];
};

function canUseFs(): boolean {
  return process.env.VERCEL !== "1";
}

export function getMarketBookStorageMode(): DurableStorageMode {
  return storageMode(canUseFs());
}

export function getMarketBookStorageLabel(): string {
  return storageLabel(getMarketBookStorageMode(), "data/comps.json");
}

export function marketBookIsDurable(): boolean {
  return getMarketBookStorageMode() !== "memory";
}

async function readJsonFile<T>(file: string): Promise<T[] | null> {
  if (!canUseFs()) return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", file),
      "utf8",
    );
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

async function writeJsonFile(file: string, data: unknown): Promise<void> {
  if (!canUseFs()) return;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
    await fs.writeFile(
      path.join(process.cwd(), "data", file),
      JSON.stringify(data, null, 2),
      "utf8",
    );
  } catch {
    /* ignore */
  }
}

export async function readComps(): Promise<MarketComp[]> {
  if (hasRedis()) {
    const fromRedis = await redisGetJson<MarketComp>(COMPS_KEY);
    if (fromRedis) {
      g.__bzlComps = fromRedis;
      return fromRedis;
    }
  }
  const fromDisk = await readJsonFile<MarketComp>("comps.json");
  if (fromDisk) {
    g.__bzlComps = fromDisk;
    return fromDisk;
  }
  return g.__bzlComps || [];
}

export async function writeComps(comps: MarketComp[]): Promise<void> {
  g.__bzlComps = comps;
  const ok = await redisSetJson(COMPS_KEY, comps);
  if (!ok) await writeJsonFile("comps.json", comps);
}

export async function addComp(
  input: Omit<MarketComp, "id" | "createdAt" | "pricePerAcre"> & {
    pricePerAcre?: number;
  },
): Promise<MarketComp> {
  const comps = await readComps();
  const acres = Number(input.acres);
  const price = Number(input.price);
  const row: MarketComp = {
    id: `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    county: input.county.trim(),
    acres,
    price,
    pricePerAcre:
      input.pricePerAcre ?? (acres > 0 ? Math.round(price / acres) : 0),
    saleDate: input.saleDate,
    landType: input.landType.trim(),
    sourceNote: input.sourceNote?.trim() || "Logged by Brandon",
    createdAt: new Date().toISOString(),
  };
  comps.unshift(row);
  await writeComps(comps);
  return row;
}

export async function deleteComp(id: string): Promise<boolean> {
  const comps = await readComps();
  const next = comps.filter((c) => c.id !== id);
  if (next.length === comps.length) return false;
  await writeComps(next);
  return true;
}

export async function readClosedDeals(): Promise<ClosedDeal[]> {
  if (hasRedis()) {
    const fromRedis = await redisGetJson<ClosedDeal>(CLOSED_KEY);
    if (fromRedis) {
      g.__bzlClosed = fromRedis;
      return fromRedis;
    }
  }
  const fromDisk = await readJsonFile<ClosedDeal>("closed-deals.json");
  if (fromDisk) {
    g.__bzlClosed = fromDisk;
    return fromDisk;
  }
  return g.__bzlClosed || [];
}

export async function writeClosedDeals(deals: ClosedDeal[]): Promise<void> {
  g.__bzlClosed = deals;
  const ok = await redisSetJson(CLOSED_KEY, deals);
  if (!ok) await writeJsonFile("closed-deals.json", deals);
}

export async function addClosedDeal(
  input: Omit<ClosedDeal, "id" | "pricePerAcre"> & { pricePerAcre?: number },
): Promise<ClosedDeal> {
  const deals = await readClosedDeals();
  const acres = Number(input.acres);
  const price = Number(input.price);
  const row: ClosedDeal = {
    id: `cd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    county: input.county.trim(),
    acres,
    price,
    pricePerAcre:
      input.pricePerAcre ?? (acres > 0 ? Math.round(price / acres) : 0),
    landType: input.landType.trim(),
    closedAt: input.closedAt,
    side: input.side,
    notes: input.notes?.trim() || "",
  };
  deals.unshift(row);
  await writeClosedDeals(deals);
  return row;
}

export async function deleteClosedDeal(id: string): Promise<boolean> {
  const deals = await readClosedDeals();
  const next = deals.filter((d) => d.id !== id);
  if (next.length === deals.length) return false;
  await writeClosedDeals(next);
  return true;
}
