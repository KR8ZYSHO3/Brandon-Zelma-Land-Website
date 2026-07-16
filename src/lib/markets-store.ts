import type { MarketArea, ServiceAreaConfig } from "@/lib/types";
import {
  DEFAULT_SERVICE_AREA,
  MARKET_CATALOG,
  REGION_PRESETS,
} from "@/lib/data/default-markets";
import {
  hasRedis,
  redisGetObject,
  redisSetJson,
  storageLabel,
  storageMode,
  type DurableStorageMode,
} from "@/lib/redis-kv";

/**
 * Service area (map markets):
 * 1. Upstash Redis (same env as leads/listings)
 * 2. Local data/service-area.json
 * 3. In-memory (unreliable on Vercel)
 */

const REDIS_KEY = "bzl:service-area";

const globalStore = globalThis as unknown as {
  __bzlServiceArea?: ServiceAreaConfig;
};

function canUseFs(): boolean {
  return process.env.VERCEL !== "1" && process.env.USE_MEMORY_MARKETS !== "1";
}

export function getServiceAreaStorageMode(): DurableStorageMode {
  return storageMode(canUseFs());
}

export function getServiceAreaStorageLabel(): string {
  return storageLabel(getServiceAreaStorageMode(), "data/service-area.json");
}

export function serviceAreaIsDurable(): boolean {
  return getServiceAreaStorageMode() !== "memory";
}

function cloneDefault(): ServiceAreaConfig {
  return {
    regionLabel: DEFAULT_SERVICE_AREA.regionLabel,
    regionBlurb: DEFAULT_SERVICE_AREA.regionBlurb,
    updatedAt: new Date().toISOString(),
    markets: MARKET_CATALOG.map((m) => ({ ...m })),
  };
}

async function readFromFs(): Promise<ServiceAreaConfig | null> {
  if (!canUseFs()) return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const file = path.join(process.cwd(), "data", "service-area.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as ServiceAreaConfig;
  } catch {
    return null;
  }
}

async function writeToFs(config: ServiceAreaConfig): Promise<void> {
  if (!canUseFs()) return;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "service-area.json"),
      JSON.stringify(config, null, 2),
      "utf8",
    );
  } catch {
    // ignore
  }
}

function mergeWithCatalog(stored: ServiceAreaConfig): ServiceAreaConfig {
  const bySlug = new Map(stored.markets.map((m) => [m.slug, m]));
  const markets: MarketArea[] = MARKET_CATALOG.map((c) => {
    const existing = bySlug.get(c.slug);
    if (existing) {
      bySlug.delete(c.slug);
      // Prefer stored active/labels; refresh coords/blurbs from catalog defaults
      return {
        ...c,
        ...existing,
        slug: c.slug,
        name: existing.name || c.name,
        state: (existing.state || c.state || "OH").toUpperCase(),
        active: Boolean(existing.active),
        lat: Number(existing.lat ?? c.lat),
        lng: Number(existing.lng ?? c.lng),
      };
    }
    return { ...c };
  });
  for (const custom of bySlug.values()) {
    markets.push({
      ...custom,
      state: (custom.state || "OH").toUpperCase(),
      active: custom.active ?? true,
    });
  }
  return {
    regionLabel: stored.regionLabel || DEFAULT_SERVICE_AREA.regionLabel,
    regionBlurb: stored.regionBlurb || DEFAULT_SERVICE_AREA.regionBlurb,
    updatedAt: stored.updatedAt,
    markets,
  };
}

export async function getServiceArea(): Promise<ServiceAreaConfig> {
  try {
    const { unstable_noStore } = await import("next/cache");
    unstable_noStore();
  } catch {
    /* non-Next context */
  }
  // Always prefer Redis so map/admin share the same state on Vercel
  if (hasRedis()) {
    const fromRedis = await redisGetObject<ServiceAreaConfig>(REDIS_KEY);
    if (fromRedis && fromRedis.markets) {
      const config = mergeWithCatalog(fromRedis);
      globalStore.__bzlServiceArea = config;
      return config;
    }
    // undefined = empty key → fall through to defaults (first visit)
    if (fromRedis === null) {
      // Redis error — try memory/file
    }
  }

  const fromDisk = await readFromFs();
  if (fromDisk) {
    const config = mergeWithCatalog(fromDisk);
    globalStore.__bzlServiceArea = config;
    return config;
  }

  if (globalStore.__bzlServiceArea) {
    return mergeWithCatalog(globalStore.__bzlServiceArea);
  }

  const config = mergeWithCatalog(cloneDefault());
  globalStore.__bzlServiceArea = config;
  return config;
}

export async function saveServiceArea(
  config: ServiceAreaConfig,
): Promise<ServiceAreaConfig> {
  const next: ServiceAreaConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
    markets: config.markets.map((m) => ({
      ...m,
      state: (m.state || "OH").toUpperCase(),
      active: Boolean(m.active),
      slug: m.slug || slugify(m.name),
    })),
  };
  const merged = mergeWithCatalog(next);
  globalStore.__bzlServiceArea = merged;
  const ok = await redisSetJson(REDIS_KEY, merged);
  if (!ok) await writeToFs(merged);
  return merged;
}

export async function getActiveMarkets(): Promise<MarketArea[]> {
  const area = await getServiceArea();
  return area.markets.filter((m) => m.active);
}

/** Backward-compatible list shaped like old FOCUS_COUNTIES (active only). */
export async function getFocusCounties() {
  return getActiveMarkets();
}

export async function applyPreset(presetId: string): Promise<ServiceAreaConfig> {
  const preset = REGION_PRESETS.find((p) => p.id === presetId);
  if (!preset) throw new Error("Unknown preset");
  const current = await getServiceArea();
  const activate = new Set(preset.activateSlugs);
  let markets = current.markets.map((m) => ({
    ...m,
    active: preset.exclusive
      ? activate.has(m.slug)
      : m.active || activate.has(m.slug),
  }));
  for (const slug of preset.activateSlugs) {
    if (!markets.some((m) => m.slug === slug)) {
      const cat = MARKET_CATALOG.find((c) => c.slug === slug);
      if (cat) markets = [...markets, { ...cat, active: true }];
    }
  }
  return saveServiceArea({
    ...current,
    regionLabel: preset.regionLabel,
    regionBlurb: `${preset.description} Coverage is controlled in Admin → Service Area.`,
    markets,
  });
}

export async function setMarketActive(
  slug: string,
  active: boolean,
): Promise<ServiceAreaConfig> {
  const current = await getServiceArea();
  const markets = current.markets.map((m) =>
    m.slug === slug ? { ...m, active } : m,
  );
  return saveServiceArea({ ...current, markets });
}

export async function addCustomMarket(
  input: Omit<MarketArea, "slug" | "active"> & {
    slug?: string;
    active?: boolean;
  },
): Promise<ServiceAreaConfig> {
  const current = await getServiceArea();
  const slug = input.slug || slugify(input.name);
  if (current.markets.some((m) => m.slug === slug)) {
    throw new Error("A market with that slug already exists");
  }
  const market: MarketArea = {
    slug,
    name: input.name,
    state: (input.state || "OH").toUpperCase(),
    blurb: input.blurb || `${input.name} land market.`,
    lat: Number(input.lat),
    lng: Number(input.lng),
    active: input.active !== false,
  };
  if (Number.isNaN(market.lat) || Number.isNaN(market.lng)) {
    throw new Error("lat and lng must be numbers");
  }
  return saveServiceArea({
    ...current,
    markets: [...current.markets, market],
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/county/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export { REGION_PRESETS, MARKET_CATALOG };
