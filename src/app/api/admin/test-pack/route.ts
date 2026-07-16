import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  countTestPack,
  purgeTestPack,
  seedTestPack,
} from "@/lib/test-pack";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const counts = await countTestPack();
  return NextResponse.json({ ok: true, counts });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "");

    if (action === "seed") {
      const result = await seedTestPack();
      return NextResponse.json({ ok: true, action: "seed", result });
    }
    if (action === "purge") {
      const result = await purgeTestPack();
      return NextResponse.json({ ok: true, action: "purge", result });
    }
    if (action === "count") {
      const counts = await countTestPack();
      return NextResponse.json({ ok: true, counts });
    }

    return NextResponse.json(
      { error: "action must be seed, purge, or count" },
      { status: 400 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
