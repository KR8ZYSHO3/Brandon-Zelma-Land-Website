import { NextResponse } from "next/server";
import { addLead, deleteLead } from "@/lib/leads-store";
import { isAdminAuthenticated } from "@/lib/auth";
import { scoreLead } from "@/lib/scoring";
import type { LeadType, MissionId } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "delete") {
      if (!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const ok = await deleteLead(String(body.id || ""));
      return NextResponse.json({ ok });
    }

    const type = body.type as LeadType;
    if (type !== "buyer" && type !== "seller") {
      return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
    }
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const counties = Array.isArray(body.counties)
      ? body.counties.map(String)
      : [];
    const mission = body.mission ? (String(body.mission) as MissionId) : undefined;
    const timeline = body.timeline ? String(body.timeline) : undefined;
    const phone = body.phone ? String(body.phone) : undefined;
    const budgetMax =
      typeof body.budgetMax === "number" ? body.budgetMax : undefined;
    const acresMin =
      typeof body.acresMin === "number" ? body.acresMin : undefined;
    const readinessScore =
      typeof body.readinessScore === "number" ? body.readinessScore : undefined;

    const score = scoreLead({
      type,
      timeline,
      budgetMax,
      acresMin,
      phone,
      counties,
      mission,
      readinessScore,
    });

    const lead = await addLead({
      type,
      name,
      email,
      phone,
      source: String(body.source || "website"),
      mission,
      counties,
      budgetMax,
      acresMin,
      timeline,
      score,
      stage: "new",
      notes: String(body.notes || ""),
      readinessScore,
      payload: body.payload && typeof body.payload === "object" ? body.payload : undefined,
    });

    return NextResponse.json({ ok: true, id: lead.id, score: lead.score });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST a lead to this endpoint. Admin reads leads after login.",
  });
}
