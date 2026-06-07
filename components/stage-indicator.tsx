"use client";

import { cn } from "@/lib/utils";

type Stage = "introduce" | "practice" | "test" | "complete";

interface StageIndicatorProps {
  currentStage: Stage;
  currentWordIndex: number;
  totalWords: number;
  className?: string;
}

export function StageIndicator({
  currentStage,
  currentWordIndex,
  totalWords,
  className,
}: StageIndicatorProps) {
  if (currentStage === "complete") return null;

  const stages: { key: Stage; label: string; badgeClass: string }[] = [
    {
      key: "introduce",
      label: "Introduce",
      badgeClass: "bg-primary-light text-primary border border-primary-light",
    },
    {
      key: "practice",
      label: "Practice",
      badgeClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
    },
    {
      key: "test",
      label: "Test",
      badgeClass: "bg-warning-light text-warning border border-warning-light",
    },
  ];

  const currentStageInfo = stages.find((s) => s.key === currentStage) || stages[0];
  const activeIndex = stages.findIndex((s) => s.key === currentStage);

  return (
    <div className={cn("w-full space-y-3 font-sans", className)}>
      <div className="flex justify-between items-center">
        <span
          className={cn(
            "px-2.5 py-0.5 text-xs font-bold rounded-full select-none uppercase tracking-wider",
            currentStageInfo.badgeClass
          )}
        >
          {currentStageInfo.label}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold select-none">
          Word {currentWordIndex + 1} of {totalWords}
        </span>
      </div>

      {/* Progress Segments */}
      <div className="grid grid-cols-3 gap-2">
        {stages.map((s, idx) => (
          <div
            key={s.key}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              idx <= activeIndex
                ? s.key === "introduce"
                  ? "bg-primary"
                  : s.key === "practice"
                  ? "bg-blue-500"
                  : "bg-warning"
                : "bg-zinc-200 dark:bg-zinc-800"
            )}
          />
        ))}
      </div>
    </div>
  );
}
