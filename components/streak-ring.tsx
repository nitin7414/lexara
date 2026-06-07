"use client";

import { StreakDisplay } from "./streak-display";

interface StreakRingProps {
  count: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakRing({ count, size = "md", className }: StreakRingProps) {
  // Map old size variants to new streak display size props
  const displaySize = size === "lg" ? "lg" : "md";
  return <StreakDisplay count={count} size={displaySize} className={className} />;
}
