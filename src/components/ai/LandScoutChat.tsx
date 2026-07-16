"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const PUBLIC_STARTERS = [
  "I want hunting land ~40 acres",
  "How do I sell my land?",
  "What’s available in Vinton?",
  "Homestead near Hocking Hills",
];

const ADMIN_STARTERS = [
  "Draft Instagram caption",
  "Lead follow-up text",
  "Summarize mission statement",
  "Year 1 financial targets",
  "Explain VA home loans",
  "VA independence path",
];

export function LandScoutChat({
  mode = "public",
  embedded = false,
  title,
}: {
  mode?: "public" | "admin";
  embedded?: boolean;
  title?: string;
}) {
  const [open, setOpen] = useState(embedded);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        mode === "admin"
          ? "Land Scout (admin). Free local brain is on — drafts, plan summaries, marketing. Optional XAI_API_KEY upgrades to Grok."
          : "I’m Land Scout — free guide for SE Ohio land. Ask about hunt, farm, homestead, timber, or how buying/selling works with Brandon.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput("");
    const nextHistory = [...messages, { role: "user" as const, content: message }];
    setMessages(nextHistory);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          mode,
          history: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEngine(data.engine === "xai" ? "Grok (xAI)" : "Free Land Scout");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: String(data.reply || "") },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Something went wrong. Try again or use Contact / Mission Lab.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const starters = mode === "admin" ? ADMIN_STARTERS : PUBLIC_STARTERS;
  const heading = title || (mode === "admin" ? "Admin AI copilot" : "Land Scout");

  const panel = (
    <div
      className={`flex flex-col overflow-hidden border border-line bg-paper shadow-[var(--shadow-soft)] ${
        embedded ? "rounded-2xl h-[480px]" : "rounded-2xl h-[min(70vh,520px)] w-[min(100vw-1.5rem,380px)]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-line bg-forest-mid px-4 py-3 text-charcoal">
        <div>
          <p className="text-sm font-semibold text-[#eef6f1]">{heading}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#c5d2cb]/80">
            {engine || "Free · no API key required"}
          </p>
        </div>
        {!embedded && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full px-2 text-lg leading-none text-[#c5d2cb] hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <div className="chat-scroll flex-1 space-y-3 overflow-y-auto bg-background/80 px-3 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto btn-action"
                : "mr-auto border border-line bg-paper text-charcoal"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <p className="text-xs text-muted px-1">Land Scout is thinking…</p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-line bg-paper p-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-line bg-limestone px-2 py-0.5 text-[10px] font-medium text-forest hover:border-moss"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "admin" ? "Ask copilot…" : "Ask about land…"}
            className="min-w-0 flex-1 rounded-full border border-line bg-limestone px-3 py-2 text-sm text-charcoal outline-none focus:border-moss"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full btn-action px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );

  if (embedded) return panel;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && panel}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full btn-action px-5 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] ring-2 ring-gold/30 transition"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" />
        {open ? "Close Land Scout" : "Ask Land Scout (free AI)"}
      </button>
    </div>
  );
}
