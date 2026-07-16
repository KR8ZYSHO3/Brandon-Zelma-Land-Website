import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addClosedDeal,
  addComp,
  readClosedDeals,
  readComps,
} from "@/lib/market-book-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    comps: await readComps(),
    closedDeals: await readClosedDeals(),
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const kind = String(body.kind || "comp");

    if (kind === "closed") {
      const deal = await addClosedDeal({
        county: String(body.county || ""),
        acres: Number(body.acres),
        price: Number(body.price),
        landType: String(body.landType || "land"),
        closedAt: String(body.closedAt || new Date().toISOString().slice(0, 10)),
        side: body.side === "buy" || body.side === "dual" ? body.side : "list",
        notes: String(body.notes || ""),
      });
      return NextResponse.json({ ok: true, deal });
    }

    const comp = await addComp({
      county: String(body.county || ""),
      acres: Number(body.acres),
      price: Number(body.price),
      saleDate: String(body.saleDate || new Date().toISOString().slice(0, 10)),
      landType: String(body.landType || "land"),
      sourceNote: String(body.sourceNote || ""),
    });
    return NextResponse.json({ ok: true, comp });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
