"use client";

import { IconBox } from "./icon-box";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  count: number;
  size?: "md" | "lg";
  className?: string;
}

export function StreakDisplay({ count, size = "md", className }: StreakDisplayProps) {
  const isLarge = size === "lg";

  return (
    <div className={cn("flex flex-col items-center justify-center select-none font-sans", className)}>
      <IconBox
        context="streak"
        icon="ti-flame"
        size={isLarge ? "lg" : "md"}
      />
      <div
        className={cn(
          "font-medium text-lexara-900 dark:text-lexara-200 mt-1.5 leading-none",
          isLarge ? "text-[20px] font-bold" : "text-[15px]"
        )}
      >
        {count}
      </div>
      {isLarge && (
        <span className="text-[11px] font-medium text-lexara-600 dark:text-lexara-400 mt-1">
          day streak
        </span>
      )}
    </div>
  );
}
