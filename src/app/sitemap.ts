import type { MetadataRoute } from "next";
import { getActiveListings } from "@/lib/listings-store";
import { getActiveMarkets } from "@/lib/markets-store";
import { getSeoConfig } from "@/lib/seo-config-store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoConfig();
  const base =
    seo.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://brandon-zelma-land-website.vercel.app";

  const staticPaths = [
    "",
    "/find",
    "/sell",
    "/listings",
    "/map",
    "/contact",
    "/about",
    "/how-we-work",
    "/field-notes",
    "/privacy",
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" || p === "/listings" ? "daily" : "weekly",
    priority: p === "" ? 1 : p === "/find" || p === "/sell" ? 0.9 : 0.7,
  }));

  try {
    const listings = await getActiveListings();
    for (const l of listings) {
      entries.push({
        url: `${base}/listings/${l.slug}`,
        lastModified: new Date(l.publishedAt || now),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  } catch {
    /* ignore */
  }

  try {
    const markets = await getActiveMarkets();
    for (const m of markets) {
      entries.push({
        url: `${base}/counties/${m.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    /* ignore */
  }

  return entries;
}
