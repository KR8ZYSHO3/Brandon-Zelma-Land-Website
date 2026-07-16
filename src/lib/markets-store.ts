import type { MarketArea, ServiceAreaConfig } from "@/lib/types";
import {
  DEFAULT_SERVICE_AREA,
  MARKET_CATALOG,
  REGION_PRESETS,
} from "@/lib/data/default-markets";

const globalStore = globalThis as unknown as {
  __bzlServiceArea?: ServiceAreaConfig;
};

function canUseFs(): boolean {
  return process.env.VERCEL !== "1" && process.env.USE_MEMORY_MARKETS !== "1";
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
    // ignore read-only
  }
}

function mergeWithCatalog(stored: ServiceAreaConfig): ServiceAreaConfig {
  const bySlug = new Map(stored.markets.map((m) => [m.slug, m]));
  // Keep custom markets not in catalog; ensure catalog entries exist
  const markets: MarketArea[] = MARKET_CATALOG.map((c) => {
    const existing = bySlug.get(c.slug);
    if (existing) {
      bySlug.delete(c.slug);
      return { ...c, ...existing, slug: c.slug };
    }
    return { ...c };
  });
  // custom ones remaining
  for (const custom of bySlug.values()) {
    markets.push({
      ...custom,
      state: custom.state || "OH",
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
  if (globalStore.__bzlServiceArea) {
    return mergeWithCatalog(globalStore.__bzlServiceArea);
  }
  const fromDisk = await readFromFs();
  const config = mergeWithCatalog(fromDisk || cloneDefault());
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
  globalStore.__bzlServiceArea = next;
  await writeToFs(next);
  return next;
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
  const markets = current.markets.map((m) => ({
    ...m,
    active: preset.exclusive ? activate.has(m.slug) : m.active || activate.has(m.slug),
  }));
  // ensure all activate slugs exist
  for (const slug of preset.activateSlugs) {
    if (!markets.some((m) => m.slug === slug)) {
      const cat = MARKET_CATALOG.find((c) => c.slug === slug);
      if (cat) markets.push({ ...cat, active: true });
    }
  }
  return saveServiceArea({
    ...current,
    regionLabel: preset.regionLabel,
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
  input: Omit<MarketArea, "slug" | "active"> & { slug?: string; active?: boolean },
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
