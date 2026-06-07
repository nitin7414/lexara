"use client";

import { useEffect, useState } from "react";
import { StreakDisplay } from "@/components/streak-display";
import { IconBox } from "@/components/icon-box";
import { cn } from "@/lib/utils";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  totalWords: number;
  accuracy: number;
  last14Days: boolean[];
}

export default function StreakPage() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStreak() {
      try {
        setLoading(true);
        const res = await fetch("/api/streak");
        if (!res.ok) throw new Error("Failed to fetch streak data");
        const streakData = await res.json();
        setData(streakData);
      } catch (err) {
        console.error("Streak page error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, []);

  const getCalendarDays = () => {
    if (!data) return [];
    
    return data.last14Days.map((completed, index) => {
      const offset = 13 - index;
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const weekday = date.toLocaleDateString("en-US", { weekday: "narrow" });
      const dayOfMonth = date.getDate();
      
      return {
        weekday,
        dayOfMonth,
        completed,
        isToday: offset === 0,
      };
    });
  };

  if (loading) {
    return <StreakSkeleton />;
  }

  if (error) {
    return <StreakError />;
  }

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Large Streak Display Header (Page bg is F4F3FF, card bg is FFFFFF with E8E6FF border) */}
      <div className="bg-white border border-[#E8E6FF] rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        {data && <StreakDisplay count={data.currentStreak} size="lg" />}
        <div>
          <h2 className="text-[15px] font-medium text-lexara-900 leading-none">
            {data?.currentStreak} Day Streak!
          </h2>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1.5">
            Best streak: {data?.longestStreak} days
          </p>
        </div>
      </div>

      {/* 14-Day Calendar Strip */}
      <div className="bg-white border border-[#E8E6FF] rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-[11px] font-bold text-lexara-600 uppercase tracking-wider">
            Last 14 Days
          </h3>
          <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">
            Complete daily sessions to lock in your streak
          </p>
        </div>

        {/* 7x2 grid */}
        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-1.5"
            >
              <span className="text-[10px] font-bold text-zinc-400">
                {day.weekday}
              </span>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all",
                  day.completed
                    ? "bg-[#7F77DD] text-white"
                    : day.isToday
                    ? "border-2 border-[#7F77DD] text-lexara-800 bg-transparent"
                    : "bg-lexara-100 text-[#AFA9EC]"
                )}
              >
                {day.dayOfMonth}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary Row (Stat cards use EEEDFE, no border) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#EEEDFE] p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-lexara-600 uppercase tracking-widest block leading-none">
            Days Active
          </span>
          <span className="text-[15px] font-medium text-lexara-900 mt-2 block leading-none">
            {data?.totalDays}
          </span>
        </div>
        <div className="bg-[#EEEDFE] p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-lexara-600 uppercase tracking-widest block leading-none">
            Words Learned
          </span>
          <span className="text-[15px] font-medium text-lexara-900 mt-2 block leading-none">
            {data?.totalWords}
          </span>
        </div>
        <div className="bg-[#EEEDFE] p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-lexara-600 uppercase tracking-widest block leading-none">
            Avg Accuracy
          </span>
          <span className="text-[15px] font-medium text-lexara-900 mt-2 block leading-none">
            {data?.accuracy}%
          </span>
        </div>
      </div>

      {/* Streak Shield Section */}
      <div className="bg-white border border-dashed border-[#E8E6FF] p-6 rounded-xl text-center space-y-3">
        <div className="flex justify-center">
          <IconBox context="info" icon="ti-shield" size="md" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[12px] font-bold text-lexara-800">
            Streak Shield
          </h4>
          <p className="text-[10px] font-medium text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Coming soon: Protect your streak even on days when you can't log in.
          </p>
        </div>
      </div>
    </div>
  );
}

function StreakSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="h-44 bg-zinc-200 rounded-xl" />
      <div className="h-48 bg-zinc-200 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-zinc-200 rounded-xl" />
        <div className="h-20 bg-zinc-200 rounded-xl" />
        <div className="h-20 bg-zinc-200 rounded-xl" />
      </div>
    </div>
  );
}

function StreakError() {
  return (
    <div className="bg-white border border-[#E8E6FF] p-8 rounded-xl text-center space-y-4 font-sans select-none">
      <div className="w-12 h-12 bg-red-100 text-[#D85A30] rounded-full flex items-center justify-center mx-auto">
        <i className="ti ti-alert-triangle text-xl" />
      </div>
      <div className="space-y-1">
        <h3 className="text-[12px] font-bold text-lexara-900">
          Something went wrong.
        </h3>
        <p className="text-[10px] text-zinc-400">
          We couldn't load your streak calendar. Try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-[#7F77DD] text-white text-xs font-bold rounded-lg uppercase tracking-wider border-none"
      >
        Try again
      </button>
    </div>
  );
}
