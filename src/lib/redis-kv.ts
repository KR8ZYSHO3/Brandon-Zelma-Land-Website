/**
 * Shared Upstash Redis REST helpers.
 * Uses UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (same DB for all keys).
 */

export function hasRedis(): boolean {
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

export async function redisCommand<T>(
  command: (string | number)[],
): Promise<T> {
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

export async function redisGetJson<T>(key: string): Promise<T[] | null> {
  if (!hasRedis()) return null;
  try {
    const raw = await redisCommand<string | null>(["GET", key]);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error(`[redis] GET ${key} failed`, e);
    return null;
  }
}

/** Single JSON object (not array). null = no Redis / error; undefined = empty key */
export async function redisGetObject<T>(key: string): Promise<T | null | undefined> {
  if (!hasRedis()) return null;
  try {
    const raw = await redisCommand<string | null>(["GET", key]);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`[redis] GET object ${key} failed`, e);
    return null;
  }
}

export async function redisSetJson(key: string, value: unknown): Promise<boolean> {
  if (!hasRedis()) return false;
  try {
    await redisCommand(["SET", key, JSON.stringify(value)]);
    return true;
  } catch (e) {
    console.error(`[redis] SET ${key} failed`, e);
    return false;
  }
}

export type DurableStorageMode = "redis" | "file" | "memory";

export function storageMode(canFile: boolean): DurableStorageMode {
  if (hasRedis()) return "redis";
  if (canFile) return "file";
  return "memory";
}

export function storageLabel(
  mode: DurableStorageMode,
  fileHint: string,
): string {
  switch (mode) {
    case "redis":
      return "Permanent (Upstash Redis)";
    case "file":
      return `Local file (${fileHint})`;
    default:
      return "Temporary memory only — will not stick on Vercel";
  }
}
