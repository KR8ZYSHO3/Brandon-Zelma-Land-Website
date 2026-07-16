import type { Listing, MissionId } from "@/lib/types";
import { MISSIONS } from "@/lib/types";

export type FitPrefs = {
  mission: MissionId;
  budgetMax?: number;
  acresMin?: number;
  acresMax?: number;
  counties?: string[];
};

export type FitResult = {
  score: number;
  band: "strong" | "good" | "stretch" | "weak";
  label: string;
  reasons: string[];
  gaps: string[];
};

const RELATED: Record<MissionId, MissionId[]> = {
  hunt: ["timber"],
  timber: ["hunt"],
  farm: ["homestead"],
  homestead: ["farm"],
};

const MISSION_KEYWORDS: Record<MissionId, string[]> = {
  hunt: [
    "hunt",
    "deer",
    "turkey",
    "wildlife",
    "food plot",
    "ridge",
    "timber",
    "creek",
    "secluded",
  ],
  farm: [
    "farm",
    "pasture",
    "open",
    "tillable",
    "hay",
    "soil",
    "barn",
    "frontage",
    "flat",
  ],
  homestead: [
    "homestead",
    "cabin",
    "home site",
    "well",
    "septic",
    "electric",
    "build",
    "garden",
    "private",
  ],
  timber: [
    "timber",
    "hardwood",
    "oak",
    "stand",
    "forest",
    "logging",
    "wooded",
    "canopy",
  ],
};

function bandOf(score: number): FitResult["band"] {
  if (score >= 75) return "strong";
  if (score >= 55) return "good";
  if (score >= 35) return "stretch";
  return "weak";
}

function labelOf(band: FitResult["band"]): string {
  switch (band) {
    case "strong":
      return "Strong fit";
    case "good":
      return "Good fit";
    case "stretch":
      return "Stretch fit";
    default:
      return "Weak fit";
  }
}

function haystack(listing: Listing): string {
  return [
    listing.title,
    listing.story,
    listing.brandonNotes,
    listing.features.join(" "),
    listing.accessNotes,
    listing.utilities,
    listing.wildlifeNotes,
    listing.soilsSummary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Transparent 0–100 mission / preference fit for a live listing. */
export function scoreListingFit(
  listing: Listing,
  prefs: FitPrefs,
): FitResult {
  let score = 8;
  const reasons: string[] = [];
  const gaps: string[] = [];
  const missionMeta = MISSIONS.find((m) => m.id === prefs.mission);
  const text = haystack(listing);

  // Mission tag (primary signal)
  if (listing.missions.includes(prefs.mission)) {
    score += 38;
    reasons.push(
      `Tagged for ${missionMeta?.label || prefs.mission} on Brandon’s book`,
    );
  } else if (RELATED[prefs.mission]?.some((m) => listing.missions.includes(m))) {
    score += 18;
    reasons.push("Related mission tag — dual-use potential");
  } else {
    gaps.push(
      `Not tagged ${missionMeta?.short || prefs.mission} yet — confirm on a walk`,
    );
  }

  // Keyword / field-note signal
  const keys = MISSION_KEYWORDS[prefs.mission] || [];
  const hits = keys.filter((k) => text.includes(k));
  if (hits.length >= 3) {
    score += 14;
    reasons.push(`Field notes mention ${hits.slice(0, 3).join(", ")}`);
  } else if (hits.length >= 1) {
    score += 7;
    reasons.push(`Some ${missionMeta?.short} language in the dossier`);
  } else {
    gaps.push("Few mission keywords in the write-up yet");
  }

  // Acres
  if (prefs.acresMin != null && prefs.acresMin > 0) {
    if (listing.acres >= prefs.acresMin) {
      score += 12;
      reasons.push(`${listing.acres}± ac meets your ${prefs.acresMin}+ min`);
    } else {
      gaps.push(
        `${listing.acres}± ac is under your ${prefs.acresMin} ac minimum`,
      );
    }
  } else {
    // Mission-typical acre heuristics when no min set
    const typical: Record<MissionId, [number, number]> = {
      hunt: [20, 200],
      farm: [15, 300],
      homestead: [3, 40],
      timber: [30, 500],
    };
    const [lo, hi] = typical[prefs.mission];
    if (listing.acres >= lo && listing.acres <= hi) {
      score += 10;
      reasons.push(`${listing.acres}± ac is in a typical ${missionMeta?.short} range`);
    } else if (listing.acres < lo) {
      gaps.push(`Smaller than many ${missionMeta?.short} buyers want`);
    }
  }

  if (prefs.acresMax != null && prefs.acresMax > 0) {
    if (listing.acres <= prefs.acresMax) {
      score += 4;
    } else {
      gaps.push(`Larger than your ${prefs.acresMax} ac max`);
      score -= 6;
    }
  }

  // Budget
  if (prefs.budgetMax != null && prefs.budgetMax > 0) {
    if (listing.price <= prefs.budgetMax) {
      score += 16;
      reasons.push("Price is within your max budget");
    } else if (listing.price <= prefs.budgetMax * 1.12) {
      score += 6;
      gaps.push("Slightly over max budget — stretch or negotiate");
    } else {
      gaps.push("Above your stated max budget");
      score -= 10;
    }
  }

  // County
  if (prefs.counties && prefs.counties.length > 0) {
    const want = prefs.counties.map((c) =>
      c.toLowerCase().replace(/\s*county\s*/g, "").trim(),
    );
    const have = listing.county.toLowerCase().replace(/\s*county\s*/g, "").trim();
    if (want.some((c) => have.includes(c) || c.includes(have))) {
      score += 12;
      reasons.push(`${listing.county} County is on your list`);
    } else {
      gaps.push(`${listing.county} County isn’t in your saved counties`);
    }
  }

  // Completeness of dossier (trust signal)
  if ((listing.accessNotes || "").length > 10) {
    score += 3;
    reasons.push("Access notes on file");
  }
  if ((listing.story || "").length > 80) {
    score += 2;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const band = bandOf(score);
  return {
    score,
    band,
    label: labelOf(band),
    reasons: reasons.slice(0, 5),
    gaps: gaps.slice(0, 4),
  };
}

export function sortListingsByFit(
  listings: Listing[],
  prefs: FitPrefs,
): { listing: Listing; fit: FitResult }[] {
  return listings
    .map((listing) => ({ listing, fit: scoreListingFit(listing, prefs) }))
    .sort((a, b) => b.fit.score - a.fit.score);
}
