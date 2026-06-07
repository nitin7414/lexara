"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Stage = "introduce" | "practice" | "test" | "complete";

interface StageIndicatorProps {
  currentStage: Stage;
  onClose?: () => void;
  className?: string;
}

export function StageIndicator({ currentStage, onClose, className }: StageIndicatorProps) {
  if (currentStage === "complete") return null;

  // Determine fill percentage
  let percent = 33;
  if (currentStage === "practice") percent = 66;
  else if (currentStage === "test") percent = 100;

  return (
    <div className={cn("w-full flex items-center gap-4 font-sans select-none", className)}>
      {/* Exit Button */}
      {onClose ? (
        <button
          onClick={onClose}
          className="text-lexara-400 hover:text-white dark:text-lexara-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <i className="ti ti-x text-lg leading-none" />
        </button>
      ) : (
        <Link
          href="/dashboard"
          className="text-lexara-400 hover:text-white dark:text-lexara-400 dark:hover:text-white transition-colors"
        >
          <i className="ti ti-x text-lg leading-none" />
        </Link>
      )}

      {/* Progress Bar Track */}
      <div className="flex-1 h-[6px] bg-[#E8E6FF] dark:bg-[#3C3489] rounded-full overflow-hidden">
        {/* Progress Bar Fill */}
        <div
          style={{ width: `${percent}%` }}
          className="h-full bg-[#7F77DD] rounded-full transition-all duration-500 ease-out"
        />
      </div>
    </div>
  );
}
