import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Simple in-memory rate limit per isolate (best-effort on serverless). */
const hits = new Map<string, { n: number; t: number }>();

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now - row.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  if (row.n >= limit) return false;
  row.n += 1;
  return true;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Security headers (all routes)
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );

  // Soft rate limits on public write APIs
  if (
    req.method === "POST" &&
    (pathname.startsWith("/api/leads") || pathname.startsWith("/api/ai"))
  ) {
    const ip = clientIp(req);
    const ok = rateLimit(`${pathname}:${ip}`, 20, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many requests — try again in a minute." },
        { status: 429 },
      );
    }
  }

  // Discourage obvious bulk scrapers on HTML (imperfect)
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  if (
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next") &&
    (ua.includes("scrapy") || ua.includes("httrack"))
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
