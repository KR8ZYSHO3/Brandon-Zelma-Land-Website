"use client";

import { usePathname } from "next/navigation";
import { LandScoutChat } from "./LandScoutChat";

export function ConditionalLandScout() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <LandScoutChat mode="public" />;
}
