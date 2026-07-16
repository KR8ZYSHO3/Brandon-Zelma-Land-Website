/**
 * Security, privacy, and anti-scraping guidance for Brandon Zelma Land.
 * Honest limits: nothing fully stops determined scrapers; layers reduce risk.
 */

export const SECURITY_PRINCIPLES = [
  {
    title: "Protect secrets",
    body: "Admin password, session secret, Upstash tokens, AI keys live only in Vercel Environment Variables — never in GitHub code or client-side JavaScript.",
  },
  {
    title: "Least public data",
    body: "Public site shows marketing content and live listings. Leads, comps, closed deals, and admin tools require login. Never expose raw lead APIs without auth.",
  },
  {
    title: "HTTPS everywhere",
    body: "Vercel + Cloudflare terminate TLS. Force HTTPS; no mixed content.",
  },
  {
    title: "Session hygiene",
    body: "HttpOnly admin cookie, same-site lax, multi-day expiry, logout clears session. Change default password in production env.",
  },
  {
    title: "Input distrust",
    body: "Forms and APIs validate types/lengths. Don’t execute user HTML. Notes fields are plain text.",
  },
  {
    title: "Privacy by design",
    body: "Collect only name/email/phone needed to respond. Don’t sell lead lists. Publish a privacy notice. Equal-prominence brokerage disclosure stays public.",
  },
];

export const IMPLEMENTED_CONTROLS = [
  {
    id: "admin-auth",
    label: "Admin login gate",
    status: "live" as const,
    detail: "Password-protected /admin and mutating APIs",
  },
  {
    id: "http-headers",
    label: "Security headers",
    status: "live" as const,
    detail: "X-Frame-Options, nosniff, referrer policy, permissions policy via middleware",
  },
  {
    id: "robots",
    label: "robots.txt + AI crawler policy",
    status: "live" as const,
    detail: "Configurable allow/block for scrapers and AI trainers in Admin → SEO",
  },
  {
    id: "rate-api",
    label: "Basic API rate limiting",
    status: "live" as const,
    detail: "Soft limit on lead/AI posts per IP window (edge middleware)",
  },
  {
    id: "no-lead-public",
    label: "Leads not public",
    status: "live" as const,
    detail: "GET /api/leads does not dump CRM; delete requires admin session",
  },
  {
    id: "redis-secrets",
    label: "Secrets off repo",
    status: "ops" as const,
    detail: "You set ADMIN_PASSWORD, UPSTASH_*, etc. in Vercel — not in code",
  },
  {
    id: "cf-bots",
    label: "Cloudflare Bot Fight Mode",
    status: "you-enable" as const,
    detail: "Turn on in Cloudflare dashboard after domain is on CF",
  },
];

export const ANTI_SCRAPE_REALITY = {
  title: "Web scraping — honest answer",
  points: [
    "You cannot fully ban scraping. Public HTML can always be copied by a determined human or bot.",
    "Goal is reduce abuse: block noisy bots, rate-limit APIs, hide private data, use Cloudflare, watch for clones.",
    "Do allow good bots you want for SEO: Googlebot, Bingbot, and (optionally) AI answer engines if you want citations.",
    "Do discourage bulk scrapers of listings for competing portals — robots + CF + not publishing private seller info.",
    "Never put unlisted addresses, lockbox codes, or client PII on public pages.",
  ],
  layers: [
    {
      layer: "robots.txt",
      effect: "Polite bots honor Disallow; bad bots ignore it",
    },
    {
      layer: "Cloudflare Bot Fight / WAF",
      effect: "Stops many automated scrapers before they hit Vercel",
    },
    {
      layer: "Rate limits on /api/*",
      effect: "Slows form spam and bulk API hammering",
    },
    {
      layer: "No public lead export",
      effect: "CRM data simply isn’t on the public site",
    },
    {
      layer: "Legal: copyright + ToS",
      effect: "Listings photos/copy are yours/brokerage — DMCA if stolen wholesale",
    },
  ],
};

export const PRIVACY_CHECKLIST = [
  "Publish /privacy (what you collect, why, how long, who sees it).",
  "Only ask for fields you will actually use to follow up.",
  "Don’t paste lead spreadsheets into random ChatGPT chats with client PII.",
  "Admin access: strong unique password in Vercel env; don’t share login casually.",
  "When using ad pixels later, disclose cookies/tracking if required.",
  "Ohio brokerage advertising: keep Buckeye equal prominence; don’t hide licensee identity.",
  "Backup: Redis free tier is durable enough for now; export important leads occasionally if needed.",
];

export const HARDENING_ROADMAP = [
  {
    when: "This week",
    items: [
      "Set strong ADMIN_PASSWORD + ADMIN_SESSION_SECRET in Vercel",
      "Confirm Upstash keys only in Vercel env",
      "Point custom domain through Cloudflare Free + Bot Fight Mode",
      "Review Admin → SEO crawler toggles",
    ],
  },
  {
    when: "Before heavy traffic",
    items: [
      "Turn on Cloudflare email routing or Workspace",
      "Add Google Search Console + Bing Webmaster verification in SEO admin",
      "Optional: Cloudflare WAF rate limiting rules on /api/leads",
    ],
  },
  {
    when: "Team / scale",
    items: [
      "Move to Postgres + per-user admin roles",
      "Audit logs for lead access",
      "Formal privacy policy review with brokerage counsel if required",
    ],
  },
];
