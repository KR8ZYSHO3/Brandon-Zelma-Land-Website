import type { MetadataRoute } from "next";
import { getSeoConfig } from "@/lib/seo-config-store";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoConfig();
  const host =
    seo.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    undefined;

  const disallow = ["/admin", "/admin/", "/api/admin"];
  if (seo.discourageScrapers) {
    // Polite scrapers only — determined bots ignore robots
    disallow.push("/api/");
  }

  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow,
    },
  ];

  if (!seo.allowAiCrawlers) {
    for (const bot of [
      "GPTBot",
      "ChatGPT-User",
      "Google-Extended",
      "anthropic-ai",
      "ClaudeBot",
      "Bytespider",
      "CCBot",
      "PerplexityBot",
    ]) {
      rules.push({ userAgent: bot, disallow: "/" });
    }
  } else if (seo.discourageScrapers) {
    for (const bot of ["CCBot", "Bytespider", "Scrapy", "magpie-crawler"]) {
      rules.push({ userAgent: bot, disallow: "/" });
    }
  }

  return {
    rules,
    sitemap: host ? `${host}/sitemap.xml` : "/sitemap.xml",
    host,
  };
}
