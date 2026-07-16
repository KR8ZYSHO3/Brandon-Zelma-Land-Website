import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Brandon Zelma Land handles contact information and site data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Privacy notice
      </h1>
      <p className="mt-3 text-sm text-muted">
        Simple English summary for visitors. Not a substitute for formal legal
        counsel if your brokerage requires a longer policy.
      </p>

      <div className="prose-land mt-8 space-y-5 text-sm leading-relaxed text-charcoal/90">
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            Who we are
          </h2>
          <p>
            Brandon Zelma Land is the personal brand site of Brandon Zelma, a
            Land Pro / salesperson with{" "}
            <strong>Buckeye Land Sales</strong>. Contact made through this site
            is for real estate inquiry and follow-up.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            What we collect
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Name, email, phone (if you provide them on forms)</li>
            <li>Mission, counties, budget, acreage, notes you type</li>
            <li>Seller readiness answers if you use the sell tool</li>
            <li>Basic technical logs (IP, browser) for security and spam control</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            How we use it
          </h2>
          <p>
            To respond to your inquiry, match land missions, prepare listing
            strategy, and improve the site. We do not sell your personal
            information as a lead list.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            Who sees it
          </h2>
          <p>
            Brandon and authorized brokerage staff as needed for representation.
            Hosting providers (e.g. Vercel, Upstash, Cloudflare if used) process
            data only to run the site.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            Cookies & AI
          </h2>
          <p>
            Admin login uses a secure session cookie. Public Land Scout AI is
            for general land education — do not submit sensitive personal or
            financial account numbers in the chat.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-forest">
            Contact
          </h2>
          <p>
            Questions: use the{" "}
            <Link href="/contact" className="text-forest underline">
              contact form
            </Link>{" "}
            or the phone number listed on the site.
          </p>
        </section>
      </div>
    </div>
  );
}
