/**
 * Effortless business plan pack for Brandon — mission, plan, financials, links.
 * Educational / planning tool. Not legal, tax, or investment advice.
 */

export const MISSION_STATEMENT = {
  short:
    "Help people buy and sell real land in Southeast Ohio with boots-on-the-ground honesty — so every tract is understood before it’s sold.",
  full: `Brandon Zelma Land exists to connect people with Southeast Ohio land they can live, hunt, farm, and hold for the long haul — through field-truth marketing, clear education, and veteran-led integrity, while operating lawfully as a Land Pro with Buckeye Land Sales and building toward a sustainable veteran-owned brokerage.`,
  values: [
    "Walk the land before you talk the land",
    "Mission over mystery — match tracts to what buyers need the land to do",
    "Own the relationship — don’t rent all demand from portals forever",
    "Serve veterans and rural families with the same standard of respect",
    "Grow production first, then independence under Ohio license law",
  ],
};

export const BUSINESS_PLAN = {
  title: "Brandon Zelma Land — Operating & Growth Plan",
  version: "2026 v1",
  summary:
    "Personal-brand land sales engine under Buckeye Land Sales that owns buyer/seller demand online, converts with field-report marketing, and builds the assets (brand, list, process, capital readiness) for a future Ohio broker-owned firm.",
  sections: [
    {
      id: "opportunity",
      title: "1. Opportunity",
      body: [
        "Rural and recreational land buyers are underserved by generic MLS/portal experiences.",
        "SE Ohio has strong hunt, homestead, farm, and timber demand from locals and Columbus/Cincinnati escapees.",
        "Most agents syndicate listings; few own a specialist brand + education engine + seller pipeline.",
      ],
    },
    {
      id: "model",
      title: "2. Business model (today)",
      body: [
        "Role: licensed real estate salesperson / Land Pro with Buckeye Land Sales.",
        "Revenue: commission splits on listing and buyer sides for land and rural property.",
        "Owned asset: Brandon Zelma Land website, email list, content, lead CRM, and processes.",
        "Cost center: time, light ads, fuel/showings, basic tools (this stack stays lean).",
      ],
    },
    {
      id: "model-future",
      title: "3. Business model (independence path)",
      body: [
        "Qualify for Ohio broker license (tenure + transaction points + education + exam).",
        "Open veteran-owned brokerage (entity, trust account, E&O, policies).",
        "Higher margin on personal production + optional team/agent splits.",
        "VA/SBA tools support the company — they do not replace the broker license.",
      ],
    },
    {
      id: "offer",
      title: "4. Offerings",
      body: [
        "Buyers: Mission Lab matching, Land IQ, field dossiers, Land Scout AI guidance, private walk-throughs.",
        "Sellers: readiness score, pricing strategy, modern marketing launch kits, boots-on-ground representation.",
        "Content: county guides, Field Notes, short-form video from property walks.",
      ],
    },
    {
      id: "gtm",
      title: "5. Go-to-market",
      body: [
        "SEO county pages + Field Notes (owned demand).",
        "YouTube/Shorts/Reels from every walk.",
        "Seller funnel first (inventory fuels everything).",
        "Sphere reactivation + veteran/4-H/FFA/local partnerships.",
        "Paid ads only after tracking works ($10–20/day tests).",
      ],
    },
    {
      id: "ops",
      title: "6. Operations",
      body: [
        "Speed-to-lead on hot inquiries; pipeline stages in admin.",
        "Weekly marketing scoreboard + decision prompts.",
        "Listing launch checklist every time a tract goes live.",
        "Quarterly review of VA/SBA/broker milestones.",
      ],
    },
    {
      id: "risks",
      title: "7. Risks & mitigations",
      body: [
        "Thin inventory → prioritize seller prospecting weekly.",
        "Portal dependency → grow owned list and SEO.",
        "Compliance → always equal-prominence Buckeye advertising.",
        "Solo capacity → ISA/VA help then team after process is documented.",
      ],
    },
  ],
};

export const FINANCIAL_PLAN = {
  title: "Financial plan (planning model)",
  disclaimer:
    "Illustrative planning numbers only — not a guarantee of income. Adjust splits, average prices, and close rates to your real book.",
  assumptions: [
    {
      label: "Avg sale price",
      value: "$280,000",
      note: "Land mix varies widely; update with your true average",
    },
    {
      label: "Gross commission rate (side)",
      value: "3.0%",
      note: "Example listing or buyer side — your deals may differ",
    },
    {
      label: "Brokerage split to you (example)",
      value: "60%",
      note: "Replace with your actual Buckeye split",
    },
    {
      label: "Net to you per side (example)",
      value: "~$5,040",
      note: "$280k × 3% × 60%",
    },
  ],
  yearTargets: [
    {
      year: "Year 1 (foundation)",
      sides: "18–24 closed sides",
      gciApprox: "$90k–$120k to you (example)",
      focus: "Site live, 8–15 active listings over year, email list, 2 content pieces/month, seller machine",
    },
    {
      year: "Year 2 (traction)",
      sides: "30–40 sides",
      gciApprox: "$150k–$200k to you (example)",
      focus: "Dominate SE Ohio SEO terms, paid tests, dual sides, hire part-time admin help",
    },
    {
      year: "Year 3 (scale / independence prep)",
      sides: "45–60 personal + team path",
      gciApprox: "$225k–$300k+ personal; team multiplies",
      focus: "Broker education complete if eligible, capital + policies ready, optional team",
    },
  ],
  budgetMonthly: [
    {
      item: "Domain name",
      amount: "~$1 / mo ($10–$15 / yr)",
      note: "Cloudflare Registrar or Porkbun — see Tech stack table below",
    },
    {
      item: "Hosting (Vercel Hobby)",
      amount: "$0",
      note: "Current stack; Pro ~$20/mo only if you outgrow free",
    },
    {
      item: "Database (Upstash Redis)",
      amount: "$0 free tier",
      note: "Leads + listings + service area + SEO config",
    },
    {
      item: "Cloudflare (DNS/CDN/bots)",
      amount: "$0 free",
      note: "Optional Pro ~$20/mo; free Bot Fight Mode is enough early",
    },
    {
      item: "Brand email",
      amount: "$0–$7",
      note: "CF Email Routing free, or Google Workspace ~$7/user",
    },
    {
      item: "Phone / data / fuel buffer",
      amount: "your existing ops",
      note: "Track per deal",
    },
    {
      item: "Paid ads (after tracking)",
      amount: "$0–$600",
      note: "Only with ROI",
    },
    {
      item: "Optional paid AI API",
      amount: "$0–$20",
      note: "Land Scout works free without a key",
    },
    {
      item: "Education (broker path)",
      amount: "lump sum when ready",
      note: "Use GI Bill / VR&E if eligible",
    },
  ],
  independenceEconomics: [
    "Under own brokerage, you keep more of each fee (after overhead).",
    "Team: 1–3 Land Pros can multiply volume toward seven-figure GCI for the firm.",
    "Path to ~$1M GCI is usually firm/team volume, not solo grind forever.",
  ],
};

export const EFFORTLESS_LINKS = [
  {
    group: "Start this week",
    links: [
      {
        label: "Apply / explore VR&E (Chapter 31)",
        href: "https://www.va.gov/careers-employment/vocational-rehabilitation/",
      },
      {
        label: "VR&E Self-Employment track",
        href: "https://www.va.gov/careers-employment/vocational-rehabilitation/programs/self-employment/",
      },
      {
        label: "SBA — Veteran-owned business",
        href: "https://www.sba.gov/business-guide/grow-your-business/veteran-owned-businesses",
      },
      {
        label: "Boots to Business overview (SBA)",
        href: "https://www.sba.gov/",
      },
      { label: "SCORE free mentoring", href: "https://www.score.org/" },
    ],
  },
  {
    group: "Ohio independence path",
    links: [
      {
        label: "Ohio broker license requirements",
        href: "https://com.ohio.gov/divisions-and-programs/real-estate-and-professional-licensing/salespersons-and-brokers/guides-and-resources/requirements-for-an-ohio-real-estate-brokers-license",
      },
      {
        label: "Ohio Division of Real Estate",
        href: "https://com.ohio.gov/divisions-and-programs/real-estate-and-professional-licensing",
      },
      { label: "Ohio REALTORS resources", href: "https://www.ohiorealtors.org/" },
    ],
  },
  {
    group: "Market & education data",
    links: [
      { label: "USDA NASS Quick Stats (land values)", href: "https://quickstats.nass.usda.gov/" },
      { label: "USDA Web Soil Survey", href: "https://websoilsurvey.nrcs.usda.gov/" },
      { label: "Buckeye Land Sales (brokerage)", href: "https://www.landforsaleinohio.com/" },
    ],
  },
];

export const MARKETING_PLAYBOOK = [
  {
    phase: "Foundation (always on)",
    tactics: [
      "Publish every listing as a field dossier + short walk video",
      "One county SEO page kept fresh per focus county",
      "Capture every lead into admin CRM with source tags",
      "Weekly email or text to sphere: ‘new ground / sold story’",
    ],
  },
  {
    phase: "Seller engine",
    tactics: [
      "Share Sell readiness score in Facebook groups carefully (comply with ads rules)",
      "Call past clients & landowners quarterly",
      "FSBO / expired outreach with value-first (comps education)",
      "Partner with foresters, auctioneers, surveyors for referrals",
    ],
  },
  {
    phase: "Buyer engine",
    tactics: [
      "Mission Lab ads: Hunt / Farm / Homestead / Timber creatives",
      "Land Scout AI → human handoff when budget + timeline clear",
      "Saved-search style follow-up when new listing matches mission",
      "Veterans & outdoor clubs content drops",
    ],
  },
  {
    phase: "Scale",
    tactics: [
      "Retargeting site visitors once pixel is live",
      "Hire ISA for speed-to-lead",
      "Listing launch kits every time (site, social, email, YouTube)",
      "Track cost per seller appointment, not vanity likes",
    ],
  },
];
