"use client";

import { useMemo, useState } from "react";
import { LeadForm } from "@/components/forms/LeadForm";

const QUESTIONS = [
  {
    id: "timeline",
    label: "How soon do you want to sell?",
    options: [
      { v: 25, t: "ASAP / under 90 days" },
      { v: 18, t: "This year" },
      { v: 10, t: "Exploring options" },
      { v: 4, t: "Just curious" },
    ],
  },
  {
    id: "access",
    label: "Deed access quality",
    options: [
      { v: 20, t: "Public road frontage" },
      { v: 14, t: "Recorded easement / good lane" },
      { v: 6, t: "Unclear or shared / rough" },
      { v: 2, t: "Not sure" },
    ],
  },
  {
    id: "condition",
    label: "Property presentation",
    options: [
      { v: 15, t: "Clean, walkable, boundaries known" },
      { v: 10, t: "Some brush / old fencing issues" },
      { v: 5, t: "Overgrown / hard to show" },
    ],
  },
  {
    id: "docs",
    label: "Paperwork readiness",
    options: [
      { v: 15, t: "Deed, survey, taxes organized" },
      { v: 9, t: "Some docs, need help" },
      { v: 3, t: "Starting from scratch" },
    ],
  },
  {
    id: "price",
    label: "Pricing mindset",
    options: [
      { v: 15, t: "Open to market-based strategy" },
      { v: 8, t: "Have a number in mind, flexible" },
      { v: 3, t: "Firm above what neighbors sold for" },
    ],
  },
  {
    id: "flexibility",
    label: "Showing / buyer access",
    options: [
      { v: 10, t: "Easy to schedule walks" },
      { v: 6, t: "Need notice" },
      { v: 2, t: "Difficult access windows" },
    ],
  },
];

export function SellReadiness() {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const score = useMemo(() => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  }, [answers]);

  const complete = Object.keys(answers).length === QUESTIONS.length;

  const band =
    score >= 75 ? "High readiness" : score >= 50 ? "Solid with prep" : "Early stage";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <fieldset
            key={q.id}
            className="rounded-2xl border border-line bg-paper p-5"
          >
            <legend className="px-1 text-sm font-semibold text-forest">
              {q.label}
            </legend>
            <div className="mt-3 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.t}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 text-sm hover:bg-limestone/50"
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.v}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: o.v }))
                    }
                  />
                  {o.t}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="rounded-2xl border border-moss/40 bg-forest-mid p-6 text-charcoal">
        <p className="text-sm uppercase tracking-wider text-sage">
          Land Sale Readiness Score
        </p>
        <p className="mt-2 font-display text-4xl font-semibold text-forest">
          {complete ? score : "—"}
          <span className="text-lg text-muted"> / 100</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          {complete
            ? `${band}. This is a decision tool for strategy — not an appraisal or guarantee of sale price.`
            : "Answer every question to unlock your score."}
        </p>
      </div>

      {complete && (
        <div>
          <h2 className="font-display text-2xl font-semibold text-forest">
            Get your seller strategy call
          </h2>
          <p className="mt-2 text-sm text-muted">
            Your readiness score rides along with the lead so Brandon can prep.
          </p>
          <div className="mt-4">
            <LeadForm
              type="seller"
              source="sell-readiness"
              readinessScore={score}
              extraPayload={{ readinessBand: band, answers }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
