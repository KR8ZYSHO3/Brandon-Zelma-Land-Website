import Link from "next/link";
import { MISSIONS } from "@/lib/types";

const ICONS: Record<string, string> = {
  hunt: "◎",
  farm: "▣",
  homestead: "⌂",
  timber: "⌬",
};

export function MissionChips() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MISSIONS.map((m, i) => (
        <Link
          key={m.id}
          href={`/find?mission=${m.id}`}
          className={`group surface-elevated p-6 transition duration-300 hover:-translate-y-1 hover:border-forest/40 animate-rise animate-rise-delay-${Math.min(i + 1, 3)}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 font-display text-lg text-forest">
            {ICONS[m.id] || "·"}
          </span>
          <p className="section-kicker mt-4">Mission</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-forest group-hover:text-forest-mid">
            {m.label}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{m.description}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-umber">
            Start this mission →
          </p>
        </Link>
      ))}
    </div>
  );
}
