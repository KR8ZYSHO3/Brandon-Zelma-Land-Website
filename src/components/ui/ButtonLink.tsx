import Link from "next/link";
import type { ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss";
  const styles =
    variant === "primary"
      ? "btn-action shadow-sm"
      : variant === "secondary"
        ? "bg-limestone text-charcoal border border-line hover:border-moss/50"
        : variant === "gold"
          ? "bg-gold/90 text-forest-deep hover:bg-gold"
          : "text-forest hover:underline";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
