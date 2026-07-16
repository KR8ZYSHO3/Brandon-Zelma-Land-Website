/**
 * Classic SEO + AI SEO (GEO / Generative Engine Optimization) playbook.
 * Configurable knobs live in Admin → SEO (seo-config-store).
 */

export const SEO_BASICS = [
  {
    title: "County pages = money pages",
    body: "Each active service-area county should answer: what land is like here, who buys, how Brandon helps, current listings. Refresh when inventory changes.",
  },
  {
    title: "Mission intent",
    body: "Hunt / farm / homestead / timber language matches how people search and how they ask ChatGPT. Use those words in titles, H1s, and FAQs.",
  },
  {
    title: "Field dossiers",
    body: "Unique listing stories beat portal copy-paste. Google and AI systems reward first-hand detail.",
  },
  {
    title: "Technical hygiene",
    body: "Sitemap, robots, fast Vercel pages, mobile layout, HTTPS, clear internal links (Buy → Mission Lab → listing → contact).",
  },
  {
    title: "Local proof",
    body: "NAP consistency (name, area, phone), Buckeye disclosure, About page with real bio — builds trust for humans and engines.",
  },
];

export const AI_SEO_EXPLAINED = {
  title: "What “AI SEO” means (2025–2026)",
  summary:
    "People don’t only Google. They ask ChatGPT, Perplexity, Gemini, Copilot, and Google AI Overviews. AI SEO (also called GEO — Generative Engine Optimization) is making Brandon’s expertise easy for those systems to find, trust, and cite.",
  goals: [
    "Be the clear local expert for SE Ohio land missions",
    "Get cited in AI answers (“land agent Athens hunting land”)",
    "Own branded queries: Brandon Zelma, Brandon Zelma Land",
    "Feed machines structured facts without giving away private client data",
  ],
};

export const AI_SEO_TACTICS = [
  {
    title: "llms.txt + site summary",
    body: "A short /llms.txt file tells AI tools who you are, what you offer, and key URLs. Editable in Admin → SEO.",
  },
  {
    title: "Answer-shaped content",
    body: "Write FAQs: “How many acres do I need to hunt in Meigs County?” Short direct answers + deeper detail. AI pulls those blocks.",
  },
  {
    title: "Entity clarity",
    body: "Same brand name everywhere. Schema.org RealEstateAgent / Person + areaServed (configured in SEO admin).",
  },
  {
    title: "Original field knowledge",
    body: "Walk notes, access truth, seasonal tips — content portals don’t have. That’s the moat for AI citations.",
  },
  {
    title: "Allow the right AI crawlers",
    body: "If you want to be recommended, allow GPTBot / Perplexity / Google-Extended selectively. If you refuse training, block trainers but still allow search.",
  },
  {
    title: "Earn mentions",
    body: "Local podcasts, 4-H, veteran orgs, soil & water districts — AI models weight third-party mentions.",
  },
];

export const AI_SEO_WEEKLY = [
  "Publish or update one county FAQ or Field Note with a clear question heading",
  "Add 3–5 lines of original walk insight to any new listing dossier",
  "Check Search Console (once connected) for queries → improve those pages",
  "Ask ChatGPT/Perplexity a test question about SE Ohio land; note if competitors appear — fill content gaps",
  "Refresh Admin → SEO “AI summary” if offerings change",
];

export const AI_CRAWLER_GUIDE = [
  {
    bot: "Googlebot",
    want: "Yes — classic search",
    note: "Keep allowed",
  },
  {
    bot: "Bingbot",
    want: "Yes",
    note: "Feeds Bing + some Copilot paths",
  },
  {
    bot: "GPTBot / ChatGPT-User",
    want: "Optional",
    note: "Allow if you want ChatGPT citations; block if you refuse OpenAI training/use",
  },
  {
    bot: "Google-Extended",
    want: "Optional",
    note: "Controls Gemini training use of your content (separate from Google search)",
  },
  {
    bot: "PerplexityBot",
    want: "Optional",
    note: "Allow for answer-engine visibility",
  },
  {
    bot: "CCBot / generic scrapers",
    want: "Usually no",
    note: "Block in robots; Cloudflare catches many that ignore robots",
  },
];
