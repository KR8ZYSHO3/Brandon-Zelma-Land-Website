import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Brandon Zelma, Southeast Ohio Land Pro with Buckeye Land Sales.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-forest">
        Contact Brandon
      </h1>
      <p className="mt-3 text-muted">
        Phone:{" "}
        <a className="font-semibold text-forest hover:underline" href="tel:7404383658">
          (740) 438-3658
        </a>
      </p>
      <p className="mt-1 text-sm text-muted">
        Brandon Zelma, Real Estate Salesperson ·{" "}
        <strong>Buckeye Land Sales</strong>
      </p>
      <div className="mt-8">
        <LeadForm type="buyer" source="contact-page" />
      </div>
      <p className="mt-6 text-xs text-muted">
        Prefer a calendar booking tool later? We can embed Cal.com free once
        Brandon shares his link.
      </p>
    </div>
  );
}
