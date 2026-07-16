import type { ClosedDeal, MarketComp } from "@/lib/types";

const g = globalThis as unknown as {
  __bzlComps?: MarketComp[];
  __bzlClosed?: ClosedDeal[];
};

function canUseFs(): boolean {
  return process.env.VERCEL !== "1";
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (!canUseFs()) {
    if (file.includes("comps")) return (g.__bzlComps as T) || fallback;
    return (g.__bzlClosed as T) || fallback;
  }
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", file),
      "utf8",
    );
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  if (file.includes("comps")) g.__bzlComps = data as MarketComp[];
  else g.__bzlClosed = data as ClosedDeal[];
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
  const data = await readJson<MarketComp[]>("comps.json", g.__bzlComps || []);
  g.__bzlComps = data;
  return data;
}

export async function writeComps(comps: MarketComp[]): Promise<void> {
  await writeJson("comps.json", comps);
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
    id: `cmp-${Date.now()}`,
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

export async function readClosedDeals(): Promise<ClosedDeal[]> {
  const data = await readJson<ClosedDeal[]>(
    "closed-deals.json",
    g.__bzlClosed || [],
  );
  g.__bzlClosed = data;
  return data;
}

export async function writeClosedDeals(deals: ClosedDeal[]): Promise<void> {
  await writeJson("closed-deals.json", deals);
}

export async function addClosedDeal(
  input: Omit<ClosedDeal, "id" | "pricePerAcre"> & { pricePerAcre?: number },
): Promise<ClosedDeal> {
  const deals = await readClosedDeals();
  const acres = Number(input.acres);
  const price = Number(input.price);
  const row: ClosedDeal = {
    id: `cd-${Date.now()}`,
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
