import { formatPrice, getActiveListings } from "@/lib/listings-store";
import { MISSIONS, FOCUS_COUNTIES } from "@/lib/types";
// FOCUS_COUNTIES used as offline fallback; live map uses admin service area
import { MISSION_STATEMENT, BUSINESS_PLAN } from "@/lib/data/business-plan";

export type AiMode = "public" | "admin";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/** Free offline Land Scout — always works with no API key. Uses live inventory. */
export async function freeLandAdvisor(
  userMessage: string,
  mode: AiMode,
): Promise<string> {
  const q = userMessage.toLowerCase().trim();
  const listings = (await getActiveListings()).filter(
    (l) => l.status === "active",
  );

  if (!q) {
    return mode === "admin"
      ? "Ask me to draft a listing blurb, marketing post, lead reply, or walk through your business plan / financial targets."
      : "Ask me what land is for (hunt, farm, homestead, timber), which SE Ohio counties fit, or how buying/selling works with Brandon.";
  }

  // --- Admin-focused intents ---
  if (mode === "admin") {
    if (/mission statement|our mission/.test(q)) {
      return `Mission (short):\n“${MISSION_STATEMENT.short}”\n\nFull:\n${MISSION_STATEMENT.full}\n\nValues:\n${MISSION_STATEMENT.values.map((v) => `• ${v}`).join("\n")}`;
    }
    if (/business plan|growth plan|operating plan/.test(q)) {
      return `${BUSINESS_PLAN.title}\n\n${BUSINESS_PLAN.summary}\n\nKey sections: ${BUSINESS_PLAN.sections.map((s) => s.title).join("; ")}.\nOpen Admin → Business Plan for the full document + links.`;
    }
    if (/financial|gci|income|budget|\$1m|million/.test(q)) {
      return `Financial planning snapshot (illustrative, not a guarantee):\n• Example net ~$5k/side on a $280k deal at 3% × 60% split — replace with your real numbers.\n• Year 1 focus: 18–24 sides + inventory machine.\n• $1M GCI usually needs team/firm volume, not solo forever.\nSee Admin → Business Plan → Financial plan for full tables.`;
    }
    if (/instagram|facebook|social|caption|reel|youtube/.test(q)) {
      const sample = listings[0];
      return `Social draft (edit before posting — include Buckeye Land Sales equal prominence):\n\n“Walked this one fence-line to fence-line.\n${sample ? `${sample.acres}± acres · ${sample.county} County · ${formatPrice(sample.price)}` : "New SE Ohio ground"}\nIf your mission is hunt, farm, homestead, or timber — let’s talk.\nBrandon Zelma · Buckeye Land Sales · link in bio”\n\nFilm tip: 15–30s of the approach + one ‘why this tract’ line.`;
    }
    if (/listing|blurb|description|dossier/.test(q)) {
      const l = listings[0];
      if (!l) return "No active listings yet to draft from — add a listing first.";
      return `Draft listing blurb for ${l.title}:\n\n${l.story}\n\nBrandon’s notes angle:\n${l.brandonNotes}\n\nCTA: Call/text for a walk. Equal housing. Info not guaranteed.`;
    }
    if (/lead|follow.?up|reply|text|email response/.test(q)) {
      return `Lead reply draft:\n\n“Hey [Name] — thanks for reaching out on SE Ohio land. I’m Brandon with Buckeye Land Sales. To match you right: what’s the land for (hunt / farm / homestead / timber), target acres, counties, and timeline? Happy to walk tracts with you once we narrow it.”`;
    }
    if (/market|pricing|comp|\$\/ac|per acre/.test(q)) {
      return `Pricing stance: use your comps journal + boots-on-ground — not portal averages alone. SE recreational land often diverges from western OH cropland indexes. Log every closed sale in Admin → Market. For sellers, talk readiness + strategy before promising a number.`;
    }
    if (/va loan|home loan|mortgage|coe|certificate of eligibility/.test(q)) {
      return `VA home loans (admin briefing):\n• Benefit for eligible veterans/service members — often low/no down on *qualifying primary residences*, not free money.\n• You are not the lender — partner with VA-approved lenders; never guarantee approval.\n• Pure raw land usually ≠ standard VA home loan; home + acreage may, if property guidelines met.\n• Use this to serve veteran buyers now and expand residential later.\nFull guide + official links: Admin → VA Loans.`;
    }
    if (/va|vre|sba|broker|independent|grant/.test(q)) {
      return `Independence path (truthful):\n1) Grow production under Buckeye.\n2) Hit Ohio broker eligibility (2 of 5 years + points + education + exam).\n3) Open your own brokerage.\nVA VR&E / SBA help the *business* — they don’t waive the broker license. Avoid “guaranteed grant” scams. Full links in Business Plan pack.\n\nFor VA *home loans* (helping buyers), see Admin → VA Loans.`;
    }
  }

  // --- Public + shared intents ---
  if (/mission|what.*(land|property).*for|hunt|farm|homestead|timber|cabin/.test(q)) {
    const hit = MISSIONS.find(
      (m) =>
        q.includes(m.id) ||
        q.includes(m.short.toLowerCase()) ||
        q.includes(m.label.toLowerCase().split(" ")[0].toLowerCase()),
    );
    if (hit) {
      const matched = listings.filter((l) => l.missions.includes(hit.id));
      return `${hit.label}: ${hit.description}\n\n${
        matched.length
          ? `Live matches in the book:\n${matched
              .map(
                (l) =>
                  `• ${l.title} — ${formatPrice(l.price)} (${l.acres}± ac, ${l.county})`,
              )
              .join("\n")}\n\nOpen /find?mission=${hit.id} or a listing dossier next.`
          : `No perfect live match tagged yet — save a mission on /find so Brandon can prospect.`
      }`;
    }
    return `Four missions we plan around:\n${MISSIONS.map((m) => `• ${m.label} — ${m.description}`).join("\n")}\n\nTell me which fits you, plus acres and budget if you know them.`;
  }

  if (/county|where|athens|vinton|hocking|meigs|morgan|perry|jackson|ross|southeast|se ohio/.test(q)) {
    return `Coverage markets (defaults — Brandon can expand beyond SE Ohio in Admin → Service Area):\n${FOCUS_COUNTIES.map((c) => `• ${c.name} — ${c.blurb}`).join("\n")}\n\nBrowse /map or a county page, or tell me your mission + preferred counties/states.`;
  }

  if (/buy|buying|how do i buy|process/.test(q)) {
    return `Buying land with Brandon (Buckeye Land Sales):\n1) Clarify mission (hunt/farm/homestead/timber)\n2) Budget, acres, counties, timeline\n3) Review field dossiers + optional walks\n4) Offer, diligence (survey, access, perc, title)\n5) Close\n\nStart Mission Lab at /find — or ask me to narrow tracts.`;
  }

  if (/sell|selling|list my|what.*(worth|value)/.test(q)) {
    return `Selling: start with the Land Sale Readiness Score on /sell — it’s a strategy tool, not an appraisal. Brandon walks access, timber, presentation, and market positioning under Buckeye Land Sales. Share county + acres for a smarter handoff.`;
  }

  if (/brandon|who are you|veteran|agent|broker/.test(q)) {
    return `I’m Land Scout — free guide for Brandon Zelma Land. Brandon is a U.S. Army veteran and Land Pro with Buckeye Land Sales (Natural Resources background, SE Ohio). I help you think through land; he walks it and handles the real estate. I can’t replace a licensed agent or give legal/appraisal advice.`;
  }

  if (/listing|available|for sale|show me|what.*have/.test(q)) {
    if (!listings.length) return "No active listings right now — leave a mission on /find so Brandon can match you when inventory is up.";
    return `Active highlights:\n${listings
      .map(
        (l) =>
          `• ${l.title}\n  ${formatPrice(l.price)} · ${l.acres}± ac · ${l.county}\n  /listings/${l.slug}`,
      )
      .join("\n\n")}`;
  }

  if (/price|cost|budget|afford|expensive|cheap/.test(q)) {
    const prices = listings.map((l) => l.price);
    if (!prices.length) return "Share a budget and mission — Brandon will match when inventory fits.";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `In the current book, active prices run roughly ${formatPrice(min)}–${formatPrice(max)}. Price/acre varies by access, timber, open ground, and location. What’s your max budget and mission?`;
  }

  // Listing name fuzzy
  const listingHit = listings.find(
    (l) =>
      q.includes(l.county.toLowerCase()) ||
      q.includes(l.slug.replace(/-/g, " ")) ||
      l.title.toLowerCase().split(" ").some((w) => w.length > 4 && q.includes(w)),
  );
  if (listingHit) {
    return `${listingHit.title}\n${formatPrice(listingHit.price)} · ${listingHit.acres}± acres · ${listingHit.county} County\n\n${listingHit.story}\n\nBrandon’s notes: ${listingHit.brandonNotes}\n\nFull dossier: /listings/${listingHit.slug}`;
  }

  return mode === "admin"
    ? `I can help with: mission statement, business/financial plan summaries, listing blurbs, social captions, lead replies, VA/broker path, and pricing discipline. Try: “Draft an Instagram caption” or “Summarize year-1 financial targets.”`
    : `I can help with missions (hunt/farm/homestead/timber), SE Ohio counties, how buying/selling works, and what’s in the current book. Try: “I want 40 acres to hunt in Vinton” or “How do I sell my land?”\n\nWhen you’re ready for a human: /contact or Mission Lab /find.`;
}

export function publicSystemPreamble(): string {
  return `You are Land Scout for Brandon Zelma Land (Brandon Zelma, salesperson with Buckeye Land Sales, SE Ohio). Help visitors clarify land missions, counties, and next steps. Never invent that Brandon is an independent broker. No appraisals or legal advice. Encourage Mission Lab /find, Sell /sell, or contact. Be concise, warm, outdoors-competent.`;
}

export function adminSystemPreamble(): string {
  return `You are Brandon's private Land OS copilot for Brandon Zelma Land under Buckeye Land Sales. Help with marketing copy, lead replies, listing language, market thinking, VA/SBA education, and business/financial plan execution. Remind: VA does not replace Ohio broker license. Be practical and concise.`;
}
