"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const GOALS = [
  {
    id: "ACADEMIC",
    title: "Academic student",
    subtitle: "NCERT level, literary vocabulary",
    icon: "ti-school",
  },
  {
    id: "EXAM_PREP",
    title: "Competitive exams",
    subtitle: "UPSC, CAT, SSC, Banking",
    icon: "ti-trophy",
  },
  {
    id: "PROFESSIONAL",
    title: "Working professional",
    subtitle: "Business English, corporate communication",
    icon: "ti-briefcase",
  },
];

export default function OnboardingPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedGoal) return;
    setLoading(true);

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: selectedGoal }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        console.error("Failed to update goal");
      }
    } catch (error) {
      console.error("Error setting onboarding goal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-sm flex flex-col space-y-8">
        {/* Brand Logo */}
        <div className="text-center">
          <span className="text-3xl font-black text-primary select-none tracking-tight">
            Lexara
          </span>
        </div>

        {/* Heading Header */}
        <div className="text-center space-y-2 select-none">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            What's your goal?
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            We'll personalize your words based on your answer.
          </p>
        </div>

        {/* Goal Card List */}
        <div className="space-y-3">
          {GOALS.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                disabled={loading}
                className={cn(
                  "w-full text-left flex items-center p-4 rounded-xl border-2 transition-all duration-200 select-none cursor-pointer",
                  isSelected
                    ? "bg-primary-light border-primary"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                )}
              >
                {/* Left Icon */}
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-colors",
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <i className={cn("ti text-xl", goal.icon)} />
                </div>

                {/* Right Labels */}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-bold text-sm",
                      isSelected
                        ? "text-primary-dark dark:text-primary"
                        : "text-zinc-950 dark:text-zinc-50"
                    )}
                  >
                    {goal.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">
                    {goal.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedGoal || loading}
          className={cn(
            "w-full py-4.5 rounded-lg text-sm font-extrabold transition-all duration-200 tracking-wide shadow-none uppercase cursor-pointer select-none",
            selectedGoal
              ? "bg-primary text-white hover:opacity-95"
              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
          )}
        >
          {loading ? "Personalizing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
