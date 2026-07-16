import type { AiMode, ChatMessage } from "./land-advisor";
import {
  adminSystemPreamble,
  freeLandAdvisor,
  publicSystemPreamble,
} from "./land-advisor";

/**
 * Free by default (local Land Scout).
 * Optional upgrade: set XAI_API_KEY for SpaceXAI / xAI Grok when you have credits.
 */
export async function runLandAi(opts: {
  message: string;
  mode: AiMode;
  history?: ChatMessage[];
}): Promise<{ reply: string; engine: "free-local" | "xai" }> {
  const key = process.env.XAI_API_KEY;

  if (!key) {
    return {
      reply: await freeLandAdvisor(opts.message, opts.mode),
      engine: "free-local",
    };
  }

  try {
    const system =
      opts.mode === "admin" ? adminSystemPreamble() : publicSystemPreamble();
    const messages = [
      { role: "system", content: system },
      ...(opts.history || [])
        .filter((m) => m.role !== "system")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: opts.message },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-4-1-fast-non-reasoning",
        messages,
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("xAI error", res.status, errText);
      return {
        reply:
          (await freeLandAdvisor(opts.message, opts.mode)) +
          "\n\n_(Cloud AI unavailable — answered with free Land Scout.)_",
        engine: "free-local",
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      (await freeLandAdvisor(opts.message, opts.mode));

    return { reply, engine: "xai" };
  } catch (e) {
    console.error(e);
    return {
      reply: await freeLandAdvisor(opts.message, opts.mode),
      engine: "free-local",
    };
  }
}
