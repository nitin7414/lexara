"use client";

import { cn } from "@/lib/utils";

interface StreakRingProps {
  count: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakRing({ count, size = "md", className }: StreakRingProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-xs border-[3px]",
    md: "w-14 h-14 text-sm border-[4px]",
    lg: "w-24 h-24 text-xl border-[5px]",
  };

  const textClasses = {
    sm: "font-bold text-zinc-800 dark:text-zinc-200",
    md: "font-extrabold text-zinc-900 dark:text-zinc-50",
    lg: "text-3xl font-black text-zinc-900 dark:text-zinc-50",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-primary flex flex-col items-center justify-center bg-white dark:bg-zinc-900 select-none shadow-none font-sans",
          sizeClasses[size]
        )}
      >
        <div className={cn("flex items-center justify-center gap-0.5", textClasses[size])}>
          <span>{count}</span>
          <span className={cn(size === "lg" ? "text-2xl" : "text-sm")}>🔥</span>
        </div>
      </div>
    </div>
  );
}
