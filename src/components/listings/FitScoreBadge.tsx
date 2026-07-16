import type { FitResult } from "@/lib/fit-score";

export function FitScoreBadge({
  fit,
  compact,
}: {
  fit: FitResult;
  compact?: boolean;
}) {
  const colors =
    fit.band === "strong"
      ? "bg-moss/20 text-forest border-moss/40"
      : fit.band === "good"
        ? "bg-gold/15 text-soil border-gold/40"
        : fit.band === "stretch"
          ? "bg-umber/10 text-soil border-line"
          : "bg-limestone text-muted border-line";

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold ${colors}`}
        title={fit.reasons.join(" · ")}
      >
        Fit {fit.score}
      </span>
    );
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 ${colors}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
          Land Fit Score
        </p>
        <p className="font-display text-2xl font-semibold">{fit.score}</p>
      </div>
      <p className="mt-0.5 text-sm font-semibold">{fit.label}</p>
      {fit.reasons.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs opacity-90">
          {fit.reasons.map((r) => (
            <li key={r}>+ {r}</li>
          ))}
        </ul>
      )}
      {fit.gaps.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs opacity-75">
          {fit.gaps.map((g) => (
            <li key={g}>· {g}</li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[10px] opacity-70">
        Educational match score — not an appraisal or guarantee.
      </p>
    </div>
  );
}
