import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "bzl_admin_session";

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-change-me-bzl-land";
}

function expectedUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD || "zelma";
}

function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function verifyCredentials(username: string, password: string): boolean {
  return (
    safeEqualString(username.trim(), expectedUsername()) &&
    safeEqualString(password, expectedPassword())
  );
}

/** @deprecated use verifyCredentials */
export function verifyPassword(password: string): boolean {
  return safeEqualString(password, expectedPassword());
}

export function signSession(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function validateSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  // 30-day sessions
  const ts = Number(payload.split(":")[1]);
  if (!ts || Date.now() - ts > 30 * 24 * 60 * 60 * 1000) return false;
  return true;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return validateSessionToken(jar.get(COOKIE)?.value);
}

export { COOKIE as ADMIN_COOKIE };
