"use client";

import { useEffect, useState } from "react";
import { StreakRing } from "@/components/streak-ring";
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
      {/* Large Streak Ring Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        {data && <StreakRing count={data.currentStreak} size="lg" />}
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
            {data?.currentStreak} Day Streak!
          </h2>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            Best streak: {data?.longestStreak} days
          </p>
        </div>
      </div>

      {/* 14-Day Calendar Strip */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Last 14 Days
          </h3>
          <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
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
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                {day.weekday}
              </span>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all",
                  day.completed
                    ? "bg-primary text-white"
                    : day.isToday
                    ? "border-2 border-primary text-primary bg-primary-light/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"
                )}
              >
                {day.dayOfMonth}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Days Active
          </span>
          <span className="text-base font-black text-zinc-900 dark:text-zinc-50 mt-1 block">
            {data?.totalDays}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Words Learned
          </span>
          <span className="text-base font-black text-zinc-900 dark:text-zinc-50 mt-1 block">
            {data?.totalWords}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center">
          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Avg Accuracy
          </span>
          <span className="text-base font-black text-zinc-900 dark:text-zinc-50 mt-1 block">
            {data?.accuracy}%
          </span>
        </div>
      </div>

      {/* Streak Shield Section */}
      <div className="bg-zinc-100 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800 p-6 rounded-xl text-center space-y-2">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto">
          <i className="ti ti-shield text-lg" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Streak Shield
          </h4>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
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
      <div className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="h-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

function StreakError() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl text-center space-y-4 font-sans select-none">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
        <i className="ti ti-alert-triangle text-xl" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
          Something went wrong.
        </h3>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          We couldn't load your streak calendar. Try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider"
      >
        Try again
      </button>
    </div>
  );
}
