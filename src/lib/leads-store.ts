import type { Lead } from "@/lib/types";

/**
 * Lead storage:
 * - Local/dev: writes data/leads.json when filesystem is writable
 * - Vercel/serverless: in-memory (resets on cold start) — fine for demo;
 *   upgrade to Supabase/Vercel KV later for production persistence
 */

const globalStore = globalThis as unknown as { __bzlLeads?: Lead[] };

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
  const fromDisk = await readFromFs();
  if (fromDisk) {
    globalStore.__bzlLeads = fromDisk;
    return fromDisk;
  }
  return memory();
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  globalStore.__bzlLeads = leads;
  await writeToFs(leads);
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
