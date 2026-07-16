import type { Lead } from "@/lib/types";

/**
 * Lead storage (shared across form POST and admin GET):
 * 1. Upstash Redis — if UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set (Vercel)
 * 2. Local file data/leads.json — when not on Vercel and disk is writable
 * 3. In-memory only — demo fallback (does NOT work reliably on Vercel serverless)
 */

const REDIS_KEY = "bzl:leads";
const globalStore = globalThis as unknown as { __bzlLeads?: Lead[] };

export type LeadsStorageMode = "redis" | "file" | "memory";

export function getLeadsStorageMode(): LeadsStorageMode {
  if (hasRedis()) return "redis";
  if (canUseFs()) return "file";
  return "memory";
}

export function getLeadsStorageLabel(): string {
  switch (getLeadsStorageMode()) {
    case "redis":
      return "Permanent (Upstash Redis)";
    case "file":
      return "Local file (data/leads.json)";
    default:
      return "Temporary memory only — will not stick on Vercel";
  }
}

export function leadsAreDurable(): boolean {
  return getLeadsStorageMode() !== "memory";
}

function hasRedis(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function redisUrl(): string {
  return process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "");
}

function redisToken(): string {
  return process.env.UPSTASH_REDIS_REST_TOKEN!;
}

async function redisCommand<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(redisUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Redis ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as { result: T };
  return data.result;
}

async function readFromRedis(): Promise<Lead[] | null> {
  if (!hasRedis()) return null;
  try {
    const raw = await redisCommand<string | null>(["GET", REDIS_KEY]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[leads] Redis read failed", e);
    return null;
  }
}

async function writeToRedis(leads: Lead[]): Promise<boolean> {
  if (!hasRedis()) return false;
  try {
    await redisCommand(["SET", REDIS_KEY, JSON.stringify(leads)]);
    return true;
  } catch (e) {
    console.error("[leads] Redis write failed", e);
    return false;
  }
}

function memory(): Lead[] {
  if (!globalStore.__bzlLeads) globalStore.__bzlLeads = [];
  return globalStore.__bzlLeads;
}

function canUseFs(): boolean {
  return process.env.VERCEL !== "1" && process.env.USE_MEMORY_LEADS !== "1";
}

async function readFromFs(): Promise<Lead[] | null> {
  if (!canUseFs()) return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const file = path.join(process.cwd(), "data", "leads.json");
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return null;
  }
}

async function writeToFs(leads: Lead[]): Promise<void> {
  if (!canUseFs()) return;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "leads.json"),
      JSON.stringify(leads, null, 2),
      "utf8",
    );
  } catch {
    // read-only FS — ignore
  }
}

export async function readLeads(): Promise<Lead[]> {
  const fromRedis = await readFromRedis();
  if (fromRedis) {
    globalStore.__bzlLeads = fromRedis;
    return fromRedis;
  }

  const fromDisk = await readFromFs();
  if (fromDisk) {
    globalStore.__bzlLeads = fromDisk;
    return fromDisk;
  }

  return memory();
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  globalStore.__bzlLeads = leads;
  const ok = await writeToRedis(leads);
  if (!ok) await writeToFs(leads);
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">,
): Promise<Lead> {
  const leads = await readLeads();
  const now = new Date().toISOString();
  const full: Lead = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  leads.unshift(full);
  // Cap memory growth in ephemeral mode
  if (leads.length > 500) leads.length = 500;
  await writeLeads(leads);
  return full;
}

export async function updateLead(
  id: string,
  patch: Partial<Lead>,
): Promise<Lead | null> {
  const leads = await readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  leads[idx] = {
    ...leads[idx],
    ...patch,
    id: leads[idx].id,
    createdAt: leads[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await writeLeads(leads);
  return leads[idx];
}
