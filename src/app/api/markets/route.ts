import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addCustomMarket,
  applyPreset,
  getServiceArea,
  saveServiceArea,
  setMarketActive,
} from "@/lib/markets-store";
import type { ServiceAreaConfig } from "@/lib/types";

/** Public + admin can read active service area */
export async function GET() {
  const area = await getServiceArea();
  return NextResponse.json({
    regionLabel: area.regionLabel,
    regionBlurb: area.regionBlurb,
    updatedAt: area.updatedAt,
    markets: area.markets,
    activeMarkets: area.markets.filter((m) => m.active),
  });
}

/** Admin-only mutations */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = String(body.action || "");

    if (action === "save") {
      const config = body.config as ServiceAreaConfig;
      if (!config?.markets) {
        return NextResponse.json({ error: "Invalid config" }, { status: 400 });
      }
      const saved = await saveServiceArea(config);
      return NextResponse.json({ ok: true, config: saved });
    }

    if (action === "preset") {
      const saved = await applyPreset(String(body.presetId || ""));
      return NextResponse.json({ ok: true, config: saved });
    }

    if (action === "toggle") {
      const saved = await setMarketActive(
        String(body.slug || ""),
        Boolean(body.active),
      );
      return NextResponse.json({ ok: true, config: saved });
    }

    if (action === "add") {
      const saved = await addCustomMarket({
        name: String(body.name || ""),
        state: String(body.state || "OH"),
        blurb: String(body.blurb || ""),
        lat: Number(body.lat),
        lng: Number(body.lng),
        active: body.active !== false,
        slug: body.slug ? String(body.slug) : undefined,
      });
      return NextResponse.json({ ok: true, config: saved });
    }

    if (action === "labels") {
      const current = await getServiceArea();
      const saved = await saveServiceArea({
        ...current,
        regionLabel: String(body.regionLabel || current.regionLabel),
        regionBlurb: String(body.regionBlurb || current.regionBlurb),
      });
      return NextResponse.json({ ok: true, config: saved });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
