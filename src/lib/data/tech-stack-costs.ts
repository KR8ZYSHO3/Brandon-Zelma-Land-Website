/**
 * Lean tech stack costs for Brandon Zelma Land (planning estimates, USD, 2026).
 * Prices change — re-check vendor sites before buying.
 */

export const TECH_STACK_RECOMMENDED = {
  title: "Recommended lean stack (what this site uses / should use)",
  summary:
    "Stay free/near-free until leads and listings pay for upgrades. You already have Vercel + GitHub + Upstash Redis. Cloudflare is optional but excellent for DNS, CDN, bot protection, and domain.",
  monthlyTotal: "$0–$15 / month typical",
  yearlyTotal: "$12–$50 / year typical (domain + optional extras)",
};

export const TECH_COST_ROWS: {
  item: string;
  option: string;
  cost: string;
  bestFor: string;
  notes: string;
  recommended?: boolean;
}[] = [
  {
    item: "Domain name",
    option: "Cloudflare Registrar or Porkbun / Namecheap",
    cost: "~$10–$15 / year (.com)",
    bestFor: "brandonzelmaland.com style brand",
    notes: "Cloudflare sells domains at cost (no markup). Point DNS to Vercel.",
    recommended: true,
  },
  {
    item: "Website hosting",
    option: "Vercel Hobby (current)",
    cost: "$0 / month",
    bestFor: "Next.js apps, previews, HTTPS",
    notes: "Free for personal/hobby. Upgrade to Pro (~$20/user/mo) only if limits hit.",
    recommended: true,
  },
  {
    item: "Database / lead storage",
    option: "Upstash Redis (current)",
    cost: "$0 / month (free tier)",
    bestFor: "Leads, listings, service area, SEO config",
    notes: "Already wired. Plenty for solo agent volume. Later: Supabase free Postgres if needed.",
    recommended: true,
  },
  {
    item: "DNS + CDN + bot shield",
    option: "Cloudflare Free",
    cost: "$0 / month",
    bestFor: "Faster pages, SSL, basic DDoS, Bot Fight Mode",
    notes: "Put domain on Cloudflare, orange-cloud proxy optional, then CNAME to Vercel.",
    recommended: true,
  },
  {
    item: "Cloudflare Pro (optional)",
    option: "Cloudflare Pro",
    cost: "~$20 / month",
    bestFor: "Heavier WAF rules, image polish, better analytics",
    notes: "Not needed day one. Free tier covers most land sites.",
  },
  {
    item: "Email for brand",
    option: "Google Workspace or Cloudflare Email Routing + Gmail",
    cost: "$0 (routing) or ~$6–$7 / user / mo (Workspace)",
    bestFor: "hello@brandonzelmaland.com",
    notes: "Email Routing is free (forwards to Gmail). Workspace looks more pro.",
  },
  {
    item: "AI (optional)",
    option: "xAI / OpenAI API key",
    cost: "$0–$20 / mo pay-as-you-go",
    bestFor: "Land Scout upgrades beyond free local advisor",
    notes: "Site works without paid AI. Add key in Vercel env when ready.",
  },
  {
    item: "Analytics",
    option: "Vercel Analytics free or Cloudflare Web Analytics",
    cost: "$0",
    bestFor: "Traffic without heavy cookies",
    notes: "Prefer privacy-friendly tools; avoid dumping raw lead PII into ad pixels carelessly.",
    recommended: true,
  },
];

export const CLOUDFLARE_DATABASE_FAQ = {
  title: "Does Cloudflare have database hosting?",
  answer: [
    "Yes — but you do not need it for this site today.",
    "Cloudflare options: D1 (SQLite SQL), Workers KV (key-value), Durable Objects, R2 (file storage like S3).",
    "This project already uses Upstash Redis (via REST) for leads, listings, market book, service area, and SEO settings. That is a real database layer suitable for a solo Land Pro.",
    "When to consider Cloudflare D1 or Supabase: multi-agent team, complex reporting, relational joins, or you want everything under one Cloudflare bill.",
    "Best practice now: keep Upstash free tier + Cloudflare Free for DNS/CDN/security. Don’t migrate DB unless you feel a real limit.",
  ],
  comparison: [
    {
      product: "Upstash Redis (current)",
      role: "App data: leads, listings, configs",
      cost: "Free tier",
    },
    {
      product: "Cloudflare D1",
      role: "SQL database on CF edge",
      cost: "Free tier + paid usage",
    },
    {
      product: "Cloudflare KV / R2",
      role: "Simple keys / media files",
      cost: "Free tier + usage",
    },
    {
      product: "Supabase / Neon Postgres",
      role: "Full CRM-style relational DB later",
      cost: "Generous free tiers",
    },
  ],
};

export const SETUP_PATHS = [
  {
    name: "Path A — Absolute lean (recommended now)",
    steps: [
      "Keep Vercel hosting (free)",
      "Keep Upstash Redis (free) for data",
      "Buy domain (~$12/yr) — Cloudflare Registrar preferred",
      "Add domain in Cloudflare → DNS → CNAME to Vercel",
      "Enable Cloudflare Bot Fight Mode (free) + email routing if wanted",
      "Monthly cash cost ≈ $0–$2 (prorated domain)",
    ],
  },
  {
    name: "Path B — Pro brand polish",
    steps: [
      "Everything in Path A",
      "Google Workspace email (~$7/mo)",
      "Optional Cloudflare Pro if bot abuse is real",
      "Optional paid AI API for Land Scout",
      "Monthly cash cost ≈ $7–$30",
    ],
  },
  {
    name: "Path C — Scale / team later",
    steps: [
      "Vercel Pro if build minutes or team seats needed",
      "Postgres (Supabase) for multi-agent CRM + roles",
      "Cloudflare WAF custom rules + rate limiting",
      "Monthly cash cost ≈ $25–$100+ depending on traffic and seats",
    ],
  },
];

export const DOMAIN_CLOUDFLARE_STEPS = [
  "Buy domain (Cloudflare Registrar or transfer in).",
  "Cloudflare dashboard → select domain → DNS.",
  "Add CNAME: www → cname.vercel-dns.com (or value Vercel shows).",
  "Add A/ALIAS/CNAME for apex (@) per Vercel domain docs.",
  "Vercel → Project → Settings → Domains → add your domain → verify.",
  "SSL: Cloudflare Full (strict) once Vercel cert is active.",
  "Security → Bots → enable Bot Fight Mode (free).",
  "Optional: Email Routing → catch-all to Brandon’s Gmail.",
];
