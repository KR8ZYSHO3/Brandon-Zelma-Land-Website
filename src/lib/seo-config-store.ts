import {
  hasRedis,
  redisGetObject,
  redisSetJson,
} from "@/lib/redis-kv";

export type SeoConfig = {
  siteUrl: string;
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  brandName: string;
  personName: string;
  brokerName: string;
  phone: string;
  email: string;
  areaServed: string;
  sameAs: string[];
  /** Short paragraph for AI systems (/llms.txt) */
  aiSummary: string;
  aiTopics: string[];
  /** Allow major AI answer/training crawlers in robots.txt */
  allowAiCrawlers: boolean;
  /** Extra Disallow rules aimed at bulk scrapers (polite bots only) */
  discourageScrapers: boolean;
  googleSiteVerification: string;
  bingSiteVerification: string;
  updatedAt: string;
};

const REDIS_KEY = "bzl:seo-config";
const g = globalThis as unknown as { __bzlSeo?: SeoConfig };

export function defaultSeoConfig(): SeoConfig {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "",
    titleDefault: "Brandon Zelma Land | Southeast Ohio Land Pro",
    titleTemplate: "%s | Brandon Zelma Land",
    description:
      "Southeast Ohio land — hunt, farm, homestead, timber. Field-report dossiers, Mission Lab, free Land Scout AI, and veteran Land Pro Brandon Zelma with Buckeye Land Sales.",
    keywords: [
      "Southeast Ohio land for sale",
      "Athens County land",
      "hunting land Ohio",
      "homestead acreage Ohio",
      "Brandon Zelma",
      "Buckeye Land Sales",
    ],
    brandName: "Brandon Zelma Land",
    personName: "Brandon Zelma",
    brokerName: "Buckeye Land Sales",
    phone: "(740) 438-3658",
    email: "",
    areaServed: "Southeast Ohio",
    sameAs: [],
    aiSummary:
      "Brandon Zelma is a U.S. Army veteran and Land Pro with Buckeye Land Sales helping buyers and sellers of hunting land, farms, homesteads, and timber in Southeast Ohio. The site offers Mission Lab (match land to purpose), field-report listing dossiers, a Land IQ map, seller readiness scoring, and free Land Scout AI guidance. Contact Brandon for boots-on-the-ground representation.",
    aiTopics: [
      "Southeast Ohio recreational land",
      "Hunting tracts Meigs Athens Vinton Hocking",
      "Homestead and small farm acreage",
      "Timber and dual-purpose land",
      "How to sell land in Southeast Ohio",
      "Veteran land agent Ohio",
    ],
    allowAiCrawlers: true,
    discourageScrapers: true,
    googleSiteVerification: "",
    bingSiteVerification: "",
    updatedAt: new Date().toISOString(),
  };
}

export async function getSeoConfig(): Promise<SeoConfig> {
  if (hasRedis()) {
    const fromRedis = await redisGetObject<SeoConfig>(REDIS_KEY);
    if (fromRedis && fromRedis.titleDefault) {
      g.__bzlSeo = { ...defaultSeoConfig(), ...fromRedis };
      return g.__bzlSeo;
    }
  }
  if (g.__bzlSeo) return { ...defaultSeoConfig(), ...g.__bzlSeo };
  return defaultSeoConfig();
}

export async function saveSeoConfig(
  patch: Partial<SeoConfig>,
): Promise<SeoConfig> {
  const current = await getSeoConfig();
  const next: SeoConfig = {
    ...current,
    ...patch,
    keywords: Array.isArray(patch.keywords)
      ? patch.keywords.map(String).map((s) => s.trim()).filter(Boolean)
      : current.keywords,
    aiTopics: Array.isArray(patch.aiTopics)
      ? patch.aiTopics.map(String).map((s) => s.trim()).filter(Boolean)
      : current.aiTopics,
    sameAs: Array.isArray(patch.sameAs)
      ? patch.sameAs.map(String).map((s) => s.trim()).filter(Boolean)
      : current.sameAs,
    allowAiCrawlers:
      patch.allowAiCrawlers !== undefined
        ? Boolean(patch.allowAiCrawlers)
        : current.allowAiCrawlers,
    discourageScrapers:
      patch.discourageScrapers !== undefined
        ? Boolean(patch.discourageScrapers)
        : current.discourageScrapers,
    updatedAt: new Date().toISOString(),
  };
  g.__bzlSeo = next;
  await redisSetJson(REDIS_KEY, next);
  return next;
}
