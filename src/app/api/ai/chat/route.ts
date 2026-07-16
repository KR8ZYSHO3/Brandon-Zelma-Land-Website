import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { runLandAi } from "@/lib/ai/client";
import type { AiMode, ChatMessage } from "@/lib/ai/land-advisor";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body.message || "").slice(0, 2000);
    let mode = (body.mode === "admin" ? "admin" : "public") as AiMode;

    if (mode === "admin") {
      const ok = await isAdminAuthenticated();
      if (!ok) {
        return NextResponse.json({ error: "Admin login required" }, { status: 401 });
      }
    }

    if (!message.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const history = Array.isArray(body.history)
      ? (body.history as ChatMessage[]).slice(-8)
      : [];

    const { reply, engine } = await runLandAi({ message, mode, history });

    return NextResponse.json({
      reply,
      engine,
      free: engine === "free-local",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
