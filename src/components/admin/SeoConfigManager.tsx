"use client";

import { useState } from "react";
import type { SeoConfig } from "@/lib/seo-config-store";

export function SeoConfigManager({ initial }: { initial: SeoConfig }) {
  const [config, setConfig] = useState(initial);
  const [keywordsText, setKeywordsText] = useState(initial.keywords.join("\n"));
  const [topicsText, setTopicsText] = useState(initial.aiTopics.join("\n"));
  const [sameAsText, setSameAsText] = useState(initial.sameAs.join("\n"));
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const field =
    "mt-1 w-full rounded-xl border border-line bg-limestone px-3 py-2 text-sm text-charcoal";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const payload: SeoConfig = {
        ...config,
        keywords: keywordsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        aiTopics: topicsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        sameAs: sameAsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setConfig(data.config as SeoConfig);
      setMsg(
        "Saved. robots.txt, llms.txt, and JSON-LD update on next public request.",
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="surface-card space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-forest">
          Site identity (classic SEO)
        </h2>
        <label className="block text-sm">
          <span className="font-medium">Canonical site URL</span>
          <input
            className={field}
            placeholder="https://brandonzelmaland.com"
            value={config.siteUrl}
            onChange={(e) => setConfig({ ...config, siteUrl: e.target.value })}
          />
          <span className="mt-1 block text-xs text-muted">
            Used in sitemap + schema. Set after custom domain is live (or leave
            blank to use request host).
          </span>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Default title</span>
          <input
            className={field}
            value={config.titleDefault}
            onChange={(e) =>
              setConfig({ ...config, titleDefault: e.target.value })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Meta description</span>
          <textarea
            rows={3}
            className={field}
            value={config.description}
            onChange={(e) =>
              setConfig({ ...config, description: e.target.value })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Keywords (one per line)</span>
          <textarea
            rows={5}
            className={field}
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Brand name</span>
            <input
              className={field}
              value={config.brandName}
              onChange={(e) =>
                setConfig({ ...config, brandName: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Person name</span>
            <input
              className={field}
              value={config.personName}
              onChange={(e) =>
                setConfig({ ...config, personName: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Brokerage (equal prominence)</span>
            <input
              className={field}
              value={config.brokerName}
              onChange={(e) =>
                setConfig({ ...config, brokerName: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Area served</span>
            <input
              className={field}
              value={config.areaServed}
              onChange={(e) =>
                setConfig({ ...config, areaServed: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Phone</span>
            <input
              className={field}
              value={config.phone}
              onChange={(e) => setConfig({ ...config, phone: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Public email (optional)</span>
            <input
              className={field}
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="font-medium">
            Social profile URLs (one per line — sameAs schema)
          </span>
          <textarea
            rows={3}
            className={field}
            placeholder="https://www.facebook.com/..."
            value={sameAsText}
            onChange={(e) => setSameAsText(e.target.value)}
          />
        </label>
      </div>

      <div className="surface-card space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-forest">
          AI SEO (answer engines)
        </h2>
        <p className="text-sm text-muted">
          Powers <code className="text-xs">/llms.txt</code> and structured facts
          AI tools can cite. Keep it accurate — no private client data.
        </p>
        <label className="block text-sm">
          <span className="font-medium">AI site summary</span>
          <textarea
            rows={5}
            className={field}
            value={config.aiSummary}
            onChange={(e) =>
              setConfig({ ...config, aiSummary: e.target.value })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Topics AI should associate (one per line)</span>
          <textarea
            rows={5}
            className={field}
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
          />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={config.allowAiCrawlers}
            onChange={(e) =>
              setConfig({ ...config, allowAiCrawlers: e.target.checked })
            }
          />
          <span>
            <strong className="text-charcoal">Allow major AI crawlers</strong>
            <span className="block text-xs text-muted">
              GPTBot, Google-Extended, PerplexityBot, etc. Turn ON to be
              recommendable in ChatGPT/Perplexity/Gemini. Turn OFF to refuse
              training/use crawlers (search engines still allowed).
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={config.discourageScrapers}
            onChange={(e) =>
              setConfig({ ...config, discourageScrapers: e.target.checked })
            }
          />
          <span>
            <strong className="text-charcoal">Discourage bulk scrapers</strong>
            <span className="block text-xs text-muted">
              Adds robots rules against common scrape bots. Pair with Cloudflare
              Bot Fight Mode — nothing stops all scrapers.
            </span>
          </span>
        </label>
      </div>

      <div className="surface-card space-y-3 p-5">
        <h2 className="font-display text-lg font-semibold text-forest">
          Search Console verification
        </h2>
        <label className="block text-sm">
          <span className="font-medium">Google site verification content</span>
          <input
            className={field}
            placeholder="google-site-verification token only"
            value={config.googleSiteVerification}
            onChange={(e) =>
              setConfig({ ...config, googleSiteVerification: e.target.value })
            }
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Bing verification content</span>
          <input
            className={field}
            value={config.bingSiteVerification}
            onChange={(e) =>
              setConfig({ ...config, bingSiteVerification: e.target.value })
            }
          />
        </label>
      </div>

      {msg && <p className="text-sm text-gold">{msg}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full btn-action px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save SEO & AI settings"}
      </button>
    </form>
  );
}
