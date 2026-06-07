"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Avatar } from "@/components/avatar";
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
}

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
        // Refresh local profile state
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

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileError />;
  }

  return (
    <div className="space-y-6 font-sans select-none relative">
      {/* Header Profile Info */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        <Avatar name={profile.name} imageUrl={profile.imageUrl} size="xl" />
        
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </h2>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5">
            {profile.email}
          </p>
        </div>

        {/* Goal badge & edit button */}
        <div className="flex flex-col items-center space-y-2">
          <span className="bg-primary-light text-primary border border-primary-light px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {getGoalLabel(profile.goal)}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <i className="ti ti-edit text-sm" />
            Edit goal
          </button>
        </div>
      </div>

      {/* Stats recap grid (2x2 style) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Stats Recap
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Current Streak
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 block mt-1">
              {profile.currentStreak} days 🔥
            </span>
          </div>
          <div className="border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Words Learned
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 block mt-1">
              {profile.totalWords} words 📚
            </span>
          </div>
          <div className="border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Accuracy %
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 block mt-1">
              {profile.accuracy}% ✓
            </span>
          </div>
          <div className="border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              Days Active
            </span>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 block mt-1">
              {profile.totalDays} active 📅
            </span>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {/* Toggle Notification */}
        <div className="flex items-center justify-between p-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Daily Notifications
            </h4>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              Remind me to maintain my streak
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Input Daily Reminder Time */}
        <div className="flex items-center justify-between p-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Reminder Time
            </h4>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              Set the time you prefer to study
            </p>
          </div>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-lg px-2 py-1 text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none focus:border-primary"
          />
        </div>

        {/* Account Details clerk redirection */}
        <a
          href="https://accounts.lexara.com/user"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Manage Account
            </h4>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              Configure login credentials and details
            </p>
          </div>
          <i className="ti ti-chevron-right text-zinc-400" />
        </a>

        {/* Sign Out Trigger using Clerk SignOutButton */}
        <div className="p-4 bg-red-50/20 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors">
          <SignOutButton>
            <button className="w-full text-left text-xs font-extrabold text-red-500 uppercase tracking-wider cursor-pointer">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Goal Selector Modal Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-t-2xl md:rounded-2xl p-6 space-y-6 relative border border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                  Update Goal
                </h3>
                <p className="text-[10px] font-semibold text-zinc-500">
                  Choose your active vocabulary focus
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg cursor-pointer"
              >
                ✕
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
                      "w-full text-left flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary-light border-primary"
                        : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl mr-3 flex items-center justify-center text-sm",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      )}
                    >
                      <i className={cn("ti", goal.icon)} />
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "text-xs font-bold",
                          isSelected
                            ? "text-primary-dark dark:text-primary"
                            : "text-zinc-900 dark:text-zinc-100"
                        )}
                      >
                        {goal.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-zinc-400">
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
    <div className="space-y-6 animate-pulse select-none">
      <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="h-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="h-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

function ProfileError() {
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
          We couldn't load your profile page. Try again.
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
