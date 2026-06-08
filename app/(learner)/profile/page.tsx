"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { IconBox } from "@/components/icon-box";
import { cn } from "@/lib/utils";

interface UserProfileData {
  name: string;
  email: string;
  goal: "ACADEMIC" | "EXAM_PREP" | "PROFESSIONAL" | string | null;
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

const BADGES = [
  {
    id: "battle",
    title: "First Battle Win",
    icon: "trophy",
    color: "text-primary",
    check: (p: UserProfileData) => p.battleWins > 0,
  },
  {
    id: "words",
    title: "Word Smith",
    icon: "book",
    color: "text-tertiary",
    check: (p: UserProfileData) => p.totalWords >= 10,
  },
  {
    id: "streak",
    title: "Hot Streak",
    icon: "local_fire_department",
    color: "text-error",
    check: (p: UserProfileData) => p.currentStreak >= 3,
  },
  {
    id: "scholar",
    title: "Scholar",
    icon: "school",
    color: "text-secondary",
    check: (p: UserProfileData) => p.totalDays >= 5,
  },
  {
    id: "polymath",
    title: "Polymath",
    icon: "psychology",
    color: "text-primary-fixed-dim",
    check: (p: UserProfileData) => p.accuracy >= 80,
  },
  {
    id: "legend",
    title: "Legend",
    icon: "star",
    color: "text-primary",
    check: (p: UserProfileData) => p.totalWords >= 50,
  },
];

const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [updatingGoal, setUpdatingGoal] = useState(false);

  // Settings UI states
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");

  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/streak");
        if (!res.ok) throw new Error("Failed to load profile data");
        const data = await res.json();
        setProfile(data);
        setSelectedGoal(data.goal);
      } catch (err) {
        console.error("Profile load error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdateGoal = async (goalId: string) => {
    setUpdatingGoal(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalId }),
      });

      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, goal: goalId } : null));
        setSelectedGoal(goalId);
        setIsModalOpen(false);
      } else {
        console.error("Failed to update goal");
      }
    } catch (err) {
      console.error("Error updating goal:", err);
    } finally {
      setUpdatingGoal(false);
    }
  };

  const getGoalLabel = (goalId: string | null) => {
    if (goalId === "ACADEMIC") return "Academic student";
    if (goalId === "EXAM_PREP") return "Exam prep";
    if (goalId === "PROFESSIONAL") return "Working professional";
    return "No goal selected";
  };

  const handleShareStats = () => {
    if (!profile) return;
    const text = `I have mastered ${profile.totalWords} words and maintained a ${profile.currentStreak}-day streak on Lexara!`;
    navigator.clipboard.writeText(text);
    alert("Statistics copied to clipboard!");
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileError />;
  }

  // Streak Milestone calculations
  const nextMilestone = profile.currentStreak <= 3 ? 3 : profile.currentStreak <= 7 ? 7 : profile.currentStreak <= 15 ? 15 : profile.currentStreak <= 30 ? 30 : profile.currentStreak <= 50 ? 50 : profile.currentStreak <= 100 ? 100 : Math.ceil(profile.currentStreak / 50) * 50;
  const streakPercent = nextMilestone > 0 ? Math.min(100, Math.round((profile.currentStreak / nextMilestone) * 100)) : 100;
  const streakText = profile.currentStreak >= nextMilestone 
    ? "Milestone reached! You are on a roll." 
    : `Maintain your streak for ${nextMilestone - profile.currentStreak} more days to reach ${nextMilestone === 3 ? "Bronze" : nextMilestone === 7 ? "Silver" : nextMilestone === 15 ? "Gold" : "Platinum"}!`;

  // Dynamic values based on profile goal
  const activeCategoryTitle = profile.goal === "ACADEMIC" 
    ? "Academic Mastery" 
    : profile.goal === "EXAM_PREP" 
      ? "Competitive Exams" 
      : "Professional English";

  const renderHeatmap = () => {
    const columns = [];
    for (let col = 0; col < 30; col++) {
      const cells = [];
      for (let row = 0; row < 7; row++) {
        const cellIndex = col * 7 + row;
        let colorClass = "bg-surface-container-highest";

        // Map last two columns to last14Days values
        if (col === 28) {
          const isActive = profile.last14Days?.[row] ?? false;
          colorClass = isActive ? "bg-primary" : "bg-surface-container-highest";
        } else if (col === 29) {
          const isActive = profile.last14Days?.[7 + row] ?? false;
          colorClass = isActive ? "bg-primary" : "bg-surface-container-highest";
        } else {
          // Mock data using stable seeded random (prevents hydration mismatch)
          const intensity = getSeededRandom(cellIndex + 42);
          if (intensity > 0.8) colorClass = "bg-primary";
          else if (intensity > 0.5) colorClass = "bg-primary/60";
          else if (intensity > 0.3) colorClass = "bg-primary/30";
        }

        cells.push(
          <div
            key={row}
            className={cn("heatmap-cell", colorClass)}
          />
        );
      }
      columns.push(
        <div key={col} className="flex flex-col gap-1">
          {cells}
        </div>
      );
    }
    return columns;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 text-[#e1e4ff] select-none font-sans">
      
      {/* Header Section: Bento Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Identity */}
        <div className="lg:col-span-8 neomorphic-card p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 border border-white/5">
          <div className="relative">
            <Link
              href="/profile/avatar"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] neomorphic-raised p-1.5 rotate-3 hover:rotate-0 transition-all duration-500 flex items-center justify-center overflow-hidden group/avatar cursor-pointer"
            >
              {profile.imageUrl ? (
                <img
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[2.2rem] group-hover/avatar:scale-105 transition-transform duration-300"
                  src={profile.imageUrl}
                />
              ) : (
                <div className="w-full h-full rounded-[2.2rem] bg-primary/10 flex items-center justify-center font-black text-primary text-3xl group-hover/avatar:scale-105 transition-transform duration-300">
                  {profile.name
                    ? profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "LX"}
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-1.5 rounded-[2.2rem] bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1 select-none">
                <span className="material-symbols-outlined text-2xl">face</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Choose Persona</span>
              </div>
            </Link>
            <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-surface">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
              Elite Learner
            </div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-1">
              {profile.name}
            </h1>
            <p className="text-on-surface-variant text-lg">
              {getGoalLabel(profile.goal)}
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="neomorphic-raised px-6 py-2.5 rounded-xl text-primary font-bold active:scale-95 transition-all text-sm border-none cursor-pointer"
              >
                Edit Goal
              </button>
              <button
                onClick={handleShareStats}
                className="neomorphic-raised px-6 py-2.5 rounded-xl text-on-surface-variant font-medium active:scale-95 transition-all text-sm flex items-center gap-2 border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share Statistics
              </button>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="lg:col-span-4 neomorphic-card p-8 rounded-[2rem] flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
          </div>
          <div className="w-20 h-20 rounded-full neomorphic-inset flex items-center justify-center text-error mb-4">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
          </div>
          <div className="text-center">
            <span className="block text-5xl font-black text-error mb-1">
              {profile.currentStreak}
            </span>
            <span className="text-on-surface-variant font-bold tracking-widest uppercase text-xs">
              Day Streak
            </span>
          </div>
          <div className="mt-6 w-full neomorphic-inset h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-error rounded-full shadow-[0_0_10px_rgba(249,115,134,0.5)] transition-all duration-500"
              style={{ width: `${streakPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-3 text-center">
            {streakText}
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="neomorphic-card p-6 rounded-3xl border border-white/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl neomorphic-inset flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Mastered</span>
          </div>
          <div className="text-3xl font-black text-on-surface leading-none">
            {profile.totalWords}
          </div>
          <div className="text-[10px] text-primary mt-2 font-bold">
            +{profile.last14Days?.[13] ? 5 : 0} today
          </div>
        </div>

        <div className="neomorphic-card p-6 rounded-3xl border border-white/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl neomorphic-inset flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">leaderboard</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Global Rank</span>
          </div>
          <div className="text-3xl font-black text-on-surface leading-none">
            #{profile.rank ?? 1}
          </div>
          <div className="text-[10px] text-tertiary mt-2 font-bold">Top 1% Worldwide</div>
        </div>

        <div className="neomorphic-card p-6 rounded-3xl border border-white/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl neomorphic-inset flex items-center justify-center text-primary/80">
              <span className="material-symbols-outlined">star_rate</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total XP</span>
          </div>
          <div className="text-3xl font-black text-on-surface leading-none">
            {profile.totalXP}
          </div>
          <div className="text-[10px] text-primary/80 mt-2 font-bold">
            Level {Math.floor(profile.totalXP / 100) + 1} Architect
          </div>
        </div>

        <div className="neomorphic-card p-6 rounded-3xl border border-white/5 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl neomorphic-inset flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">swords</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Battle Wins</span>
          </div>
          <div className="text-3xl font-black text-on-surface leading-none">
            {profile.battleWins}
          </div>
          <div className="text-[10px] text-secondary mt-2 font-bold">Wins in Arena</div>
        </div>
      </section>

      {/* Grid: Word Mastery, Settings & Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Word Mastery & Preferences */}
        <section className="xl:col-span-1 space-y-6">
          
          {/* Word Mastery Card */}
          <div className="neomorphic-card p-6 rounded-[2rem] space-y-8 border border-white/5">
            <div className="space-y-6">
              <div className="text-center py-4">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Active Category</span>
                <h4 className="text-2xl font-headline font-extrabold text-on-surface mt-1">
                  {activeCategoryTitle}
                </h4>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="w-32 h-32 rounded-full neomorphic-inset flex items-center justify-center border-4 border-primary/20">
                  <span className="text-3xl font-black text-primary">
                    {profile.accuracy}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full neomorphic-inset h-4 rounded-full p-1">
                  <div
                    className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(192,193,255,0.4)] transition-all duration-500"
                    style={{ width: `${profile.accuracy}%` }}
                  />
                </div>
                <p className="text-[10px] text-center text-on-surface-variant font-medium">
                  Spaced repetition accuracy
                </p>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
                  Switch Category
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleUpdateGoal("PROFESSIONAL")}
                    disabled={updatingGoal}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 rounded-lg transition-colors group border-none bg-transparent cursor-pointer w-full text-left",
                      profile.goal === "PROFESSIONAL" ? "bg-surface-container-high" : "hover:bg-surface-container-high"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      profile.goal === "PROFESSIONAL" ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
                    )}>Business English</span>
                    <span className="text-xs font-bold text-primary/60">64%</span>
                  </button>
                  
                  <button
                    onClick={() => handleUpdateGoal("EXAM_PREP")}
                    disabled={updatingGoal}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 rounded-lg transition-colors group border-none bg-transparent cursor-pointer w-full text-left",
                      profile.goal === "EXAM_PREP" ? "bg-surface-container-high" : "hover:bg-surface-container-high"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      profile.goal === "EXAM_PREP" ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
                    )}>Competitive Exams</span>
                    <span className="text-xs font-bold text-primary/60">92%</span>
                  </button>
                  
                  <button
                    onClick={() => handleUpdateGoal("ACADEMIC")}
                    disabled={updatingGoal}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 rounded-lg transition-colors group border-none bg-transparent cursor-pointer w-full text-left",
                      profile.goal === "ACADEMIC" ? "bg-surface-container-high" : "hover:bg-surface-container-high"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      profile.goal === "ACADEMIC" ? "text-primary font-bold" : "text-on-surface-variant group-hover:text-on-surface"
                    )}>Academic student</span>
                    <span className="text-xs font-bold text-primary/60">45%</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="neomorphic-card p-6 rounded-[2rem] space-y-6 border border-white/5">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-headline font-bold text-on-surface">Preferences</h3>
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </div>
            
            <div className="space-y-4 divide-y divide-outline-variant/10">
              
              {/* Toggle Notification */}
              <div className="flex items-center justify-between pt-0 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white">Daily Notifications</h4>
                  <p className="text-[10px] font-medium text-on-surface-variant">Remind me to maintain my streak</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-secondary-container/30 border border-outline-variant/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Reminder Time */}
              <div className="flex items-center justify-between pt-3 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white">Reminder Time</h4>
                  <p className="text-[10px] font-medium text-on-surface-variant">Set the time you prefer to study</p>
                </div>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-surface-container neomorphic-inset border-none rounded-lg px-2.5 py-1 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary w-24 text-center"
                />
              </div>

              {/* Manage Account Link */}
              <a
                href="https://accounts.lexara.com/user"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between pt-3 pb-3 group hover:opacity-80 transition-opacity"
              >
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">Manage Account</h4>
                  <p className="text-[10px] font-medium text-on-surface-variant">Configure credentials and details</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </a>

              {/* Sign Out Button */}
              <div className="pt-4 flex justify-center">
                <SignOutButton>
                  <button className="w-full neomorphic-raised py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-error hover:text-white hover:bg-error/20 active:scale-95 transition-all border-none cursor-pointer">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Milestones & Heatmap */}
        <section className="xl:col-span-2 space-y-8">
          
          {/* Milestone Badges */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-headline font-bold text-on-surface">Milestone Badges</h3>
              <button className="text-sm font-bold text-primary hover:underline transition-all bg-transparent border-none cursor-pointer">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {BADGES.map((badge) => {
                const isUnlocked = badge.check(profile);
                return (
                  <div key={badge.id} className={cn("group relative flex flex-col items-center", !isUnlocked && "opacity-40 grayscale")}>
                    <div className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                      isUnlocked 
                        ? `${badge.color} neomorphic-raised group-hover:text-tertiary` 
                        : "neomorphic-inset text-on-surface-variant"
                    )}>
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: isUnlocked ? "'FILL' 1" : undefined }}>
                        {badge.icon}
                      </span>
                    </div>
                    <span className="hidden group-hover:block absolute -top-10 bg-surface-bright px-2 py-1 rounded text-[10px] whitespace-nowrap border border-white/5 z-10 shadow-lg text-white">
                      {badge.title} {isUnlocked ? "(Unlocked)" : "(Locked)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Activity Heatmap */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-headline font-bold text-on-surface">Learning Activity</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant">Less</span>
                <div className="flex gap-1">
                  <div className="heatmap-cell bg-surface-container-highest" />
                  <div className="heatmap-cell bg-primary/30" />
                  <div className="heatmap-cell bg-primary/60" />
                  <div className="heatmap-cell bg-primary" />
                </div>
                <span className="text-[10px] text-on-surface-variant">More</span>
              </div>
            </div>
            
            <div className="neomorphic-card p-6 rounded-[2rem] border border-white/5 overflow-x-auto">
              <div className="flex gap-1 min-w-[600px] justify-between">
                <div className="flex gap-1 w-full h-32 items-end">
                  {renderHeatmap()}
                </div>
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                <span>September</span>
                <span>October</span>
                <span>November</span>
                <span>December</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Goal Selector Modal Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-low w-full max-w-sm rounded-[2rem] p-6 space-y-6 relative border border-white/5 animate-in slide-in-from-bottom duration-200 neomorphic-card">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="text-lg font-headline font-bold text-white leading-none">
                  Update Goal
                </h3>
                <p className="text-[10px] font-semibold text-on-surface-variant mt-1.5">
                  Choose your active vocabulary focus
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-white text-lg cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Goal selector options */}
            <div className="space-y-3">
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    disabled={updatingGoal}
                    onClick={() => handleUpdateGoal(goal.id)}
                    className={cn(
                      "w-full text-left flex items-center p-4 border transition-all cursor-pointer rounded-2xl",
                      isSelected
                        ? "bg-surface-container-highest border-primary"
                        : "bg-surface border-transparent hover:bg-surface-container-high"
                    )}
                  >
                    {/* IconBox context-colored badge */}
                    <div className="mr-3">
                      <IconBox context={goal.context} icon={goal.icon} size="sm" />
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "text-xs font-bold",
                          isSelected ? "text-primary" : "text-white"
                        )}
                      >
                        {goal.title}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                        {goal.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none max-w-6xl mx-auto">
      <div className="h-64 bg-surface-container-high rounded-[2rem]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-28 bg-surface-container-high rounded-3xl" />
        <div className="h-28 bg-surface-container-high rounded-3xl" />
        <div className="h-28 bg-surface-container-high rounded-3xl" />
        <div className="h-28 bg-surface-container-high rounded-3xl" />
      </div>
    </div>
  );
}

function ProfileError() {
  return (
    <div className="neomorphic-card p-8 rounded-[2rem] border border-white/5 text-center space-y-4 max-w-md mx-auto select-none text-on-surface">
      <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-xl">warning</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white">
          Something went wrong.
        </h3>
        <p className="text-xs text-on-surface-variant">
          We couldn't load your profile page. Try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="neomorphic-raised px-6 py-2.5 rounded-xl text-primary font-bold active:scale-95 transition-all text-xs border-none cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
