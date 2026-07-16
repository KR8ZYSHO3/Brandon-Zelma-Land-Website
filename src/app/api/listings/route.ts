import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addListing,
  deleteListing,
  getActiveListings,
  readListings,
  updateListing,
} from "@/lib/listings-store";
import type { ListingStatus, MissionId } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  if (all) {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ listings: await readListings() });
  }
  return NextResponse.json({ listings: await getActiveListings() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const action = String(body.action || "create");

    if (action === "delete") {
      const ok = await deleteListing(String(body.id || ""));
      return NextResponse.json({ ok });
    }

    if (action === "update") {
      const listing = await updateListing(String(body.id || ""), {
        title: body.title,
        price: body.price,
        acres: body.acres,
        county: body.county,
        lat: body.lat,
        lng: body.lng,
        addressDisplay: body.addressDisplay,
        story: body.story,
        brandonNotes: body.brandonNotes,
        features: body.features,
        missions: body.missions as MissionId[] | undefined,
        status: body.status as ListingStatus | undefined,
        accessNotes: body.accessNotes,
        utilities: body.utilities,
        soilsSummary: body.soilsSummary,
        floodNote: body.floodNote,
        wildlifeNotes: body.wildlifeNotes,
        videoUrl: body.videoUrl,
      });
      if (!listing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, listing });
    }

    // create
    if (!body.title || !body.county || body.price == null || body.acres == null) {
      return NextResponse.json(
        { error: "title, county, price, and acres are required" },
        { status: 400 },
      );
    }
    const listing = await addListing({
      title: String(body.title),
      price: Number(body.price),
      acres: Number(body.acres),
      county: String(body.county),
      lat: Number(body.lat ?? 39.3),
      lng: Number(body.lng ?? -82.5),
      addressDisplay: body.addressDisplay
        ? String(body.addressDisplay)
        : undefined,
      story: body.story ? String(body.story) : undefined,
      brandonNotes: body.brandonNotes ? String(body.brandonNotes) : undefined,
      features: Array.isArray(body.features)
        ? body.features.map(String)
        : body.features
          ? String(body.features)
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      missions: Array.isArray(body.missions)
        ? (body.missions as MissionId[])
        : undefined,
      status: (body.status as ListingStatus) || "active",
      accessNotes: body.accessNotes ? String(body.accessNotes) : undefined,
      utilities: body.utilities ? String(body.utilities) : undefined,
      soilsSummary: body.soilsSummary ? String(body.soilsSummary) : undefined,
      floodNote: body.floodNote ? String(body.floodNote) : undefined,
      wildlifeNotes: body.wildlifeNotes
        ? String(body.wildlifeNotes)
        : undefined,
      videoUrl: body.videoUrl ? String(body.videoUrl) : undefined,
    });
    return NextResponse.json({ ok: true, listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
