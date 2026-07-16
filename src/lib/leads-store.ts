import type { Lead } from "@/lib/types";
import {
  hasRedis,
  redisGetJson,
  redisSetJson,
  storageLabel,
  storageMode,
  type DurableStorageMode,
} from "@/lib/redis-kv";

/**
 * Lead storage:
 * 1. Upstash Redis (same env as listings)
 * 2. Local data/leads.json
 * 3. In-memory (unreliable on Vercel)
 */

const REDIS_KEY = "bzl:leads";
const globalStore = globalThis as unknown as { __bzlLeads?: Lead[] };

export type LeadsStorageMode = DurableStorageMode;

function canUseFs(): boolean {
  return process.env.VERCEL !== "1" && process.env.USE_MEMORY_LEADS !== "1";
}

export function getLeadsStorageMode(): LeadsStorageMode {
  return storageMode(canUseFs());
}

export function getLeadsStorageLabel(): string {
  return storageLabel(getLeadsStorageMode(), "data/leads.json");
}

export function leadsAreDurable(): boolean {
  return getLeadsStorageMode() !== "memory";
}

function memory(): Lead[] {
  if (!globalStore.__bzlLeads) globalStore.__bzlLeads = [];
  return globalStore.__bzlLeads;
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
    /* ignore */
  }
}

export async function readLeads(): Promise<Lead[]> {
  if (hasRedis()) {
    const fromRedis = await redisGetJson<Lead>(REDIS_KEY);
    if (fromRedis) {
      globalStore.__bzlLeads = fromRedis;
      return fromRedis;
    }
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
  const ok = await redisSetJson(REDIS_KEY, leads);
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

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  await writeLeads(next);
  return true;
}
