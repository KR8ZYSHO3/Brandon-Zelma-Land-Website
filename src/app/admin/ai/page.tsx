import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LandScoutChat } from "@/components/ai/LandScoutChat";

export default async function AdminAiPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />
      <p className="section-kicker">Private copilot</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-forest">
        Land Scout — Admin AI
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        <strong>Free by default</strong> (local Land Scout trained on your
        site’s purpose: land missions, listings, marketing drafts, VA/business
        plan). Optional: add{" "}
        <code className="rounded bg-limestone px-1">XAI_API_KEY</code> in{" "}
        <code className="rounded bg-limestone px-1">.env.local</code> for SpaceXAI
        / Grok upgrade.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LandScoutChat mode="admin" embedded title="Admin Land Scout" />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="surface-card p-5">
            <h2 className="font-semibold text-forest">Best uses</h2>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
              <li>Instagram / Facebook / YouTube captions</li>
              <li>Lead reply texts & emails</li>
              <li>Listing blurbs from walk notes</li>
              <li>Mission statement & plan summaries</li>
              <li>Financial target reminders</li>
              <li>VA / broker path truth-checks</li>
            </ul>
          </div>
          <div className="surface-card p-5">
            <h2 className="font-semibold text-forest">Visitor AI (public)</h2>
            <p className="mt-2 text-sm text-muted">
              Site visitors get the same free Land Scout via the floating button
              — focused on missions, counties, and next steps — not your private
              GCI math.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-limestone/40 p-4 text-xs text-muted">
            Never put API keys in the browser. Keep{" "}
            <code>XAI_API_KEY</code> server-side only. AI is not a licensed
            appraisal or legal advice.
          </div>
        </div>
      </div>
    </div>
  );
}
