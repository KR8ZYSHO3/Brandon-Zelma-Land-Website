import type { LeadType, MissionId } from "@/lib/types";

export interface ScoreInput {
  type: LeadType;
  timeline?: string;
  budgetMax?: number;
  acresMin?: number;
  phone?: string;
  counties?: string[];
  mission?: MissionId;
  readinessScore?: number;
}

/** Simple transparent lead score 0–100 for routing priority. */
export function scoreLead(input: ScoreInput): number {
  let score = 20;

  if (input.phone) score += 15;
  if (input.counties && input.counties.length > 0) score += 10;
  if (input.mission) score += 10;

  if (input.timeline) {
    const t = input.timeline.toLowerCase();
    if (t.includes("asap") || t.includes("30") || t.includes("immediate")) score += 25;
    else if (t.includes("90") || t.includes("3 month")) score += 15;
    else if (t.includes("6") || t.includes("year")) score += 5;
  }

  if (input.type === "buyer") {
    if (input.budgetMax && input.budgetMax >= 100000) score += 10;
    if (input.acresMin && input.acresMin >= 10) score += 5;
  }

  if (input.type === "seller") {
    const r = input.readinessScore ?? 0;
    score += Math.min(30, Math.round(r * 0.3));
  }

  return Math.max(0, Math.min(100, score));
}

export function scoreLabel(score: number): "hot" | "warm" | "cool" {
  if (score >= 70) return "hot";
  if (score >= 45) return "warm";
  return "cool";
}
