import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSeoConfig, saveSeoConfig } from "@/lib/seo-config-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, config: await getSeoConfig() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const config = await saveSeoConfig(body.config || body);
    return NextResponse.json({ ok: true, config });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
