import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { SeoConfigManager } from "@/components/admin/SeoConfigManager";
import { getSeoConfig } from "@/lib/seo-config-store";
import {
  AI_CRAWLER_GUIDE,
  AI_SEO_EXPLAINED,
  AI_SEO_TACTICS,
  AI_SEO_WEEKLY,
  SEO_BASICS,
} from "@/lib/data/ai-seo-playbook";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const config = await getSeoConfig();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Search + AI answers</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        SEO & AI SEO
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Configure how Google <em>and</em> ChatGPT / Perplexity / AI Overviews
        understand Brandon Zelma Land. Settings save to Redis and drive{" "}
        <code className="text-xs">robots.txt</code>,{" "}
        <code className="text-xs">sitemap.xml</code>,{" "}
        <code className="text-xs">llms.txt</code>, and JSON-LD.
      </p>
      <p className="mt-2 text-xs text-muted">
        Public files:{" "}
        <a href="/robots.txt" className="text-forest underline" target="_blank">
          /robots.txt
        </a>{" "}
        ·{" "}
        <a href="/sitemap.xml" className="text-forest underline" target="_blank">
          /sitemap.xml
        </a>{" "}
        ·{" "}
        <a href="/llms.txt" className="text-forest underline" target="_blank">
          /llms.txt
        </a>
        {" · "}
        <Link href="/admin/security" className="text-forest underline">
          Security & privacy
        </Link>
      </p>

      <div className="mt-8">
        <SeoConfigManager initial={config} />
      </div>

      <section className="mt-12 surface-elevated p-6">
        <h2 className="font-display text-xl font-semibold text-forest">
          {AI_SEO_EXPLAINED.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {AI_SEO_EXPLAINED.summary}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {AI_SEO_EXPLAINED.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-forest">
          Classic SEO still matters
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SEO_BASICS.map((s) => (
            <div key={s.title} className="surface-card p-4">
              <p className="font-semibold text-forest">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-forest">
          AI SEO tactics
        </h2>
        <div className="mt-3 space-y-3">
          {AI_SEO_TACTICS.map((t) => (
            <div key={t.title} className="surface-card p-4">
              <p className="font-semibold text-forest">{t.title}</p>
              <p className="mt-1 text-sm text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Weekly AI SEO habits
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
            {AI_SEO_WEEKLY.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ol>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-display text-lg font-semibold text-forest">
            Crawler cheat sheet
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {AI_CRAWLER_GUIDE.map((b) => (
              <li key={b.bot} className="rounded-lg border border-line px-3 py-2">
                <p className="font-semibold text-charcoal">
                  {b.bot}{" "}
                  <span className="text-xs font-medium text-moss">
                    · {b.want}
                  </span>
                </p>
                <p className="text-xs text-muted">{b.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 surface-card p-5">
        <h2 className="font-display text-lg font-semibold text-forest">
          Setup checklist (do once)
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Save settings above with accurate phone, area, and AI summary.</li>
          <li>
            Add custom domain → set <strong className="text-charcoal">Site URL</strong>{" "}
            → save again.
          </li>
          <li>
            Google Search Console → Add property → paste verification token
            above → Submit sitemap{" "}
            <code className="text-xs">/sitemap.xml</code>.
          </li>
          <li>Bing Webmaster Tools → same with Bing token.</li>
          <li>
            Test: ask ChatGPT “Who sells hunting land near Athens Ohio?” after
            content builds for a few weeks — iterate county FAQs.
          </li>
        </ol>
      </section>
    </div>
  );
}
