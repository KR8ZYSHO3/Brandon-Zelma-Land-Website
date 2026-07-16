import { NextResponse } from "next/server";
import { addWatch, matchListingsForWatch, readWatches, deleteWatch } from "@/lib/watch-store";
import { addLead } from "@/lib/leads-store";
import { scoreLead } from "@/lib/scoring";
import { isAdminAuthenticated } from "@/lib/auth";
import type { MissionId } from "@/lib/types";
import { MISSIONS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const watches = await readWatches();
  return NextResponse.json({ watches });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "delete") {
      if (!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const ok = await deleteWatch(String(body.id || ""));
      return NextResponse.json({ ok });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const mission = String(body.mission || "") as MissionId;
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }
    if (!MISSIONS.some((m) => m.id === mission)) {
      return NextResponse.json({ error: "Pick a mission" }, { status: 400 });
    }

    const counties = Array.isArray(body.counties)
      ? body.counties.map(String)
      : [];
    const budgetMax =
      typeof body.budgetMax === "number" && !Number.isNaN(body.budgetMax)
        ? body.budgetMax
        : undefined;
    const acresMin =
      typeof body.acresMin === "number" && !Number.isNaN(body.acresMin)
        ? body.acresMin
        : undefined;
    const acresMax =
      typeof body.acresMax === "number" && !Number.isNaN(body.acresMax)
        ? body.acresMax
        : undefined;
    const phone = body.phone ? String(body.phone) : undefined;
    const notes = String(body.notes || "");

    const watch = await addWatch({
      name,
      email,
      phone,
      mission,
      counties,
      budgetMax,
      acresMin,
      acresMax,
      notes,
    });

    // Also land in CRM so Command / Leads stay the single pipeline
    const score = scoreLead({
      type: "buyer",
      timeline: "90-days",
      budgetMax,
      acresMin,
      phone,
      counties,
      mission,
    });
    await addLead({
      type: "buyer",
      name,
      email,
      phone,
      source: "watch-radar",
      mission,
      counties,
      budgetMax,
      acresMin,
      acresMax,
      timeline: "watch-alert",
      score: Math.min(100, score + 8),
      stage: "nurture",
      notes: `Watch Radar: ${notes}`.trim(),
      payload: { watchId: watch.id },
    });

    const matches = await matchListingsForWatch(watch);
    return NextResponse.json({
      ok: true,
      id: watch.id,
      matches: matches.map((m) => ({
        slug: m.listing.slug,
        title: m.listing.title,
        score: m.score,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
