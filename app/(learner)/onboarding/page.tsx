"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBox } from "@/components/icon-box";
import { cn } from "@/lib/utils";

const GOALS = [
  {
    id: "ACADEMIC",
    title: "Academic student",
    subtitle: "NCERT level, literary vocabulary",
    icon: "ti-school",
    context: "progress" as const,
  },
  {
    id: "EXAM_PREP",
    title: "Competitive exams",
    subtitle: "UPSC, CAT, SSC, Banking",
    icon: "ti-trophy",
    context: "trophy" as const,
  },
  {
    id: "PROFESSIONAL",
    title: "Working professional",
    subtitle: "Business English, corporate communication",
    icon: "ti-briefcase",
    context: "info" as const,
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
    <div className="min-h-[75vh] flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-sm flex flex-col space-y-6">
        {/* Brand Logo */}
        <div className="text-center">
          <span className="text-[20px] font-black text-lexara-500 select-none tracking-tight">
            Lexara
          </span>
        </div>

        {/* Heading Header */}
        <div className="text-center space-y-1.5 select-none">
          <h1 className="text-[15px] font-medium text-lexara-900">
            What's your goal?
          </h1>
          <p className="text-[11px] text-lexara-600">
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
                  "w-full text-left flex items-center p-4 rounded-xl border transition-all duration-200 select-none cursor-pointer",
                  isSelected
                    ? "bg-lexara-100 border-2 border-lexara-500 p-[15px]" // 2px border compensates 1px padding
                    : "bg-white border border-[#E8E6FF] hover:bg-zinc-50/60"
                )}
              >
                {/* Left Icon using context-colored IconBox */}
                <div className="mr-4">
                  <IconBox context={goal.context} icon={goal.icon} size="md" />
                </div>

                {/* Right Labels */}
                <div className="flex-1">
                  <h3 className="text-[12px] font-bold text-lexara-800">
                    {goal.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                    {goal.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button (CTAs Guidelines: radius 12px, padding 11px, size 13px, weight 500) */}
        <button
          onClick={handleContinue}
          disabled={!selectedGoal || loading}
          className={cn(
            "w-full py-[11px] rounded-xl text-[13px] font-medium transition-all duration-200 tracking-wide uppercase cursor-pointer select-none border-none",
            selectedGoal
              ? "bg-[#7F77DD] text-white hover:opacity-95"
              : "bg-lexara-100 text-lexara-400 cursor-not-allowed"
          )}
        >
          {loading ? "Personalizing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
