"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StreakData {
  name: string;
  email: string;
  imageUrl: string | null;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  totalWords: number;
  accuracy: number;
  last14Days: boolean[];
  battleWins: number;
  totalXP: number;
  rank: number;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  size: string;
  duration: number;
  tx: string;
}

export default function StreakPage() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

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

  // Flame particles animation logic
  useEffect(() => {
    if (loading || error || !data || data.currentStreak === 0) return;

    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const newParticle: Particle = {
        id,
        left: `${20 + Math.random() * 60}%`, // center particles around the flame base
        top: "70%",
        size: `${Math.random() * 4 + 2}px`,
        duration: 1200 + Math.random() * 800,
        tx: `${(Math.random() - 0.5) * 60}px`, // drift horizontally
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    }, 250);

    return () => clearInterval(interval);
  }, [loading, error, data]);

  if (loading) {
    return <StreakSkeleton />;
  }

  if (error || !data) {
    return <StreakError />;
  }

  // Calculate milestone details
  const getMilestoneInfo = (streak: number) => {
    const milestones = [
      { day: 7, name: "Bronze Spark", reward: "100 Bonus XP" },
      { day: 14, name: "Silver Ember", reward: "250 Bonus XP" },
      { day: 30, name: "Gold Flame", reward: "400 Bonus XP" },
      { day: 50, name: "Elite Gold", reward: "500 Bonus XP" },
      { day: 100, name: "Sovereign Fire", reward: "1,000 Bonus XP" },
      { day: 365, name: "Immortal Sun", reward: "5,000 Bonus XP" },
    ];
    
    const next = milestones.find((m) => m.day > streak) || {
      day: Math.ceil((streak + 1) / 100) * 100,
      name: "Legendary Flame",
      reward: "1,000 Bonus XP",
    };
    
    const prevIndex = milestones.findIndex((m) => m.day > streak) - 1;
    const prev = prevIndex >= 0 ? milestones[prevIndex] : { day: 0 };
    
    const progress = Math.min(
      100,
      Math.round(((streak - prev.day) / (next.day - prev.day)) * 100)
    );
    
    return {
      name: next.name,
      day: next.day,
      reward: next.reward,
      progress: isNaN(progress) ? 0 : progress,
      daysRemaining: next.day - streak,
    };
  };

  const milestone = getMilestoneInfo(data.currentStreak);

  // Calculate multiplier: every 7 days adds +0.25 multiplier up to max x2.5
  const multiplier = (1 + Math.min(1.5, Math.floor(data.currentStreak / 7) * 0.25)).toFixed(1);

  // Generate calendar days from the last 14 days boolean history array
  const getCalendarDays = () => {
    return data.last14Days.map((completed, index) => {
      const offset = 13 - index;
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const dayOfMonth = date.getDate();
      
      return {
        weekday,
        dayOfMonth,
        completed,
        isToday: offset === 0,
      };
    });
  };

  const calendarDays = getCalendarDays();
  const firstName = data.name ? data.name.split(" ")[0] : "Learner";

  return (
    <div className="space-y-12 select-none pb-12 text-on-surface">
      {/* Hero Section */}
      <section className="relative w-full mx-auto pt-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Hero Left Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left flex-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase mb-4 streak-neomorphic-inset">
              Active Streak
            </span>
            <h2 className="text-6xl md:text-8xl font-black text-on-surface tracking-tighter mb-4">
              {data.currentStreak} {data.currentStreak === 1 ? "Day" : "Days"}
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed">
              {data.currentStreak > 0
                ? `You’ve been unstoppable, ${firstName}. That's ${
                    Math.floor(data.currentStreak / 7) === 0
                      ? `${data.currentStreak} days`
                      : Math.floor(data.currentStreak / 7) === 1
                      ? "1 week"
                      : `${Math.floor(data.currentStreak / 7)} weeks`
                  } of consistent growth and mastery.`
                : `Get started on your learning routine today, ${firstName}, and spark your learning streak!`}
            </p>
            
            {/* Quick Metrics */}
            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
              <div className="streak-neomorphic-raised p-4 rounded-2xl streak-glass-panel text-center min-w-[120px]">
                <p className="text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">
                  Current Multiplier
                </p>
                <p className="text-2xl font-bold text-primary">
                  x{multiplier} XP
                </p>
              </div>
              <div className="streak-neomorphic-raised p-4 rounded-2xl streak-glass-panel text-center min-w-[120px]">
                <p className="text-on-surface-variant text-[10px] uppercase tracking-wider mb-1">
                  Rank Position
                </p>
                <p className="text-2xl font-bold text-tertiary">
                  #{data.rank}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Right Flame Graphic */}
          <div className="order-1 lg:order-2 streak-flame-container relative shrink-0">
            <div className="absolute -inset-4 bg-primary/20 blur-[80px] rounded-full"></div>
            
            {/* Flame Image */}
            <img
              alt="Luminous 3D Streak Flame"
              className={cn(
                "w-[260px] md:w-[360px] h-auto object-contain relative z-10 transition-transform duration-700 mix-blend-screen pointer-events-none select-none",
                data.currentStreak > 0 ? "animate-pulse" : "opacity-30 grayscale"
              )}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxf35ywILPmODovPWCXOgmqjE9H-omepPdH_I8l4NpI6ANck2Lxe-pJOKBXuJGPfyoUC83CAHK461X8BukIUxXESAAkoeKqcceU7qxMe8MZjShus-aeDukbh-nh6AioxWjPKgkZWEOPfrtBk3y2U8IUhhhXEZuo3uYu5Re_Edj34VqQwlMaa67iHmWqFYJrMw8Tn1FUMEFg9AnWmisblSTs_QkURueKVqo_NMTykVN9LfROKDckFG4CsN9SWO761GRqN5G-uNAtpQ"
            />

            {/* Float Particles Emitter */}
            {data.currentStreak > 0 &&
              particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute bg-primary rounded-full blur-[1px] opacity-0 animate-rise-fade z-20 pointer-events-none"
                  style={
                    {
                      width: p.size,
                      height: p.size,
                      left: p.left,
                      top: p.top,
                      animationDuration: `${p.duration}ms`,
                      "--tx": p.tx,
                    } as React.CSSProperties
                  }
                />
              ))}
          </div>
        </div>
      </section>

      {/* Stats & Progress Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        
        {/* Milestone Progress Card (colspan 8) */}
        <div className="lg:col-span-8 streak-neomorphic-raised p-8 rounded-3xl bg-surface-container streak-glass-panel">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-1">
                Next Milestone: {milestone.name}
              </h3>
              <p className="text-on-surface-variant text-sm">
                Stay active for {milestone.daysRemaining} more {milestone.daysRemaining === 1 ? "day" : "days"} to unlock the milestone frame.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-black text-primary">
                {milestone.progress}%
              </span>
            </div>
          </div>

          {/* Progress Bar container */}
          <div className="h-10 w-full streak-neomorphic-inset bg-surface-container-lowest rounded-full p-2 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full shadow-[0_0_20px_rgba(131,66,244,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${milestone.progress}%` }}
            />
            {/* Markers */}
            <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
              <div className="w-1 h-2 bg-on-background/20 rounded-full" />
              <div className="w-1 h-2 bg-on-background/20 rounded-full" />
              <div className="w-1 h-2 bg-on-background/20 rounded-full" />
              <div className="w-1 h-2 bg-on-background/20 rounded-full" />
            </div>
          </div>

          {/* Reward Perks */}
          <div className="mt-6 flex gap-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Reward
                </p>
                <p className="text-sm font-bold">{milestone.reward}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Badge
                </p>
                <p className="text-sm font-bold">{milestone.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Quick Stats Card (colspan 4) */}
        <div className="lg:col-span-4 streak-neomorphic-raised p-8 rounded-3xl bg-surface-container streak-glass-panel flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-6">Daily Activity</h3>
            <div className="space-y-6">
              {/* Total XP */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl streak-neomorphic-raised flex items-center justify-center text-primary bg-surface border border-outline-variant/10">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <span className="font-medium text-sm">Total XP</span>
                </div>
                <span className="text-lg font-bold text-on-surface">
                  {data.totalXP.toLocaleString()}
                </span>
              </div>
              
              {/* Avg Accuracy */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl streak-neomorphic-raised flex items-center justify-center text-tertiary bg-surface border border-outline-variant/10">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <span className="font-medium text-sm">Accuracy</span>
                </div>
                <span className="text-lg font-bold text-on-surface">
                  {data.accuracy}%
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/learn"
            className="mt-8 block w-full py-4 text-center streak-neomorphic-raised bg-surface-bright text-primary font-bold rounded-2xl hover:text-on-background transition-all active:scale-[0.98] border border-outline-variant/10"
          >
            Practice Now
          </Link>
        </div>

        {/* Consistency Map Card (colspan 12) */}
        <div className="lg:col-span-12 streak-neomorphic-raised p-8 rounded-3xl bg-surface-container streak-glass-panel">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Consistency Map</h3>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 rounded-lg streak-neomorphic-inset bg-surface-container-lowest text-primary text-xs font-bold border border-outline-variant/5">
                14 Days
              </span>
            </div>
          </div>

          {/* 7x2 grid */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day, idx) => {
              return (
                <div key={idx} className="flex flex-col items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {day.weekday}
                  </span>
                  
                  {day.completed ? (
                    day.isToday ? (
                      /* Today Completed: Glowing Flame */
                      <div className="w-full aspect-square max-w-[64px] rounded-2xl shadow-[0_0_20px_rgba(131,66,244,0.4)] streak-neomorphic-inset flex items-center justify-center bg-primary-container relative">
                        <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-2xl" />
                        <span className="material-symbols-outlined text-white z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
                          local_fire_department
                        </span>
                      </div>
                    ) : (
                      /* Past completed: Checkmark */
                      <div className="w-full aspect-square max-w-[64px] rounded-2xl streak-neomorphic-raised flex items-center justify-center text-primary bg-surface-container-highest border border-outline-variant/5">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                    )
                  ) : day.isToday ? (
                    /* Today Incomplete: Pulsing flame outlines */
                    <div className="w-full aspect-square max-w-[64px] rounded-2xl border border-dashed border-primary/40 flex items-center justify-center text-primary bg-surface-container-low animate-pulse">
                      <span className="material-symbols-outlined text-primary/60">
                        local_fire_department
                      </span>
                    </div>
                  ) : (
                    /* Past/Future incomplete: Empty dot */
                    <div className="w-full aspect-square max-w-[64px] rounded-2xl streak-neomorphic-inset bg-surface-container-lowest flex items-center justify-center opacity-40 border border-outline-variant/5">
                      <div className="w-2 h-2 rounded-full bg-outline" />
                    </div>
                  )}
                  
                  <span className="text-[10px] text-on-surface-variant font-semibold">
                    {day.dayOfMonth}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation Quote Card (colspan 12) */}
        <div className="lg:col-span-12 streak-neomorphic-raised rounded-3xl overflow-hidden bg-gradient-to-br from-primary-container/30 to-surface-container-highest border border-primary/20">
          <div className="p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <span className="material-symbols-outlined text-6xl text-primary opacity-50" style={{ fontVariationSettings: "'FILL' 1" }}>
                format_quote
              </span>
            </div>
            <div className="flex-1">
              <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed text-on-primary-container">
                "The secret of your future is hidden in your daily routine. Great things are not done by impulse, but by a series of small things brought together."
              </blockquote>
              <p className="mt-4 font-bold text-primary">
                — {firstName}, Day {data.currentStreak}
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/learn"
                className="inline-block streak-neomorphic-raised px-8 py-4 bg-primary text-on-primary font-black rounded-full hover:scale-105 active:scale-95 transition-all"
              >
                Keep Going
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StreakSkeleton() {
  return (
    <div className="space-y-12 animate-pulse select-none pb-12">
      {/* Hero Header Skeleton */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-8">
        <div className="space-y-4 flex-1">
          <div className="h-6 w-32 bg-surface-container-high rounded-full" />
          <div className="h-20 w-80 bg-surface-container-high rounded-2xl" />
          <div className="h-12 w-96 bg-surface-container-high rounded-2xl" />
          <div className="flex gap-4">
            <div className="h-16 w-32 bg-surface-container-high rounded-2xl" />
            <div className="h-16 w-32 bg-surface-container-high rounded-2xl" />
          </div>
        </div>
        <div className="w-[300px] h-[300px] bg-surface-container-high rounded-full shrink-0" />
      </div>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-8 h-64 bg-surface-container-high rounded-3xl" />
        <div className="lg:col-span-4 h-64 bg-surface-container-high rounded-3xl" />
        <div className="lg:col-span-12 h-80 bg-surface-container-high rounded-3xl" />
        <div className="lg:col-span-12 h-44 bg-surface-container-high rounded-3xl" />
      </div>
    </div>
  );
}

function StreakError() {
  return (
    <div className="bg-surface-container border border-outline-variant/10 p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto select-none text-on-surface shadow-xl">
      <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto shadow-sm">
        <span className="material-symbols-outlined text-[24px]">warning</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-on-surface">
          Something went wrong.
        </h3>
        <p className="text-xs text-on-surface-variant">
          We couldn't load your streak calendar. Try reloading the page.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer border-none shadow-lg shadow-primary/20 active:scale-95 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
