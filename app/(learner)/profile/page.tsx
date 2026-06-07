"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Avatar } from "@/components/avatar";
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

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return <ProfileError />;
  }

  return (
    <div className="space-y-6 font-sans select-none relative text-lexara-900">
      {/* Header Profile Info (Card bg: FFFFFF with E8E6FF border) */}
      <div className="bg-white border border-[#E8E6FF] rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        <Avatar name={profile.name} imageUrl={profile.imageUrl} size="xl" />
        
        <div>
          <h2 className="text-[15px] font-medium text-lexara-900 leading-none">
            {profile.name}
          </h2>
          <p className="text-[10px] text-zinc-400 font-semibold mt-1.5">
            {profile.email}
          </p>
        </div>

        {/* Goal badge & edit button */}
        <div className="flex flex-col items-center space-y-2.5">
          <span className="bg-[#EEEDFE] text-[#7F77DD] border border-[#EEEDFE] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {getGoalLabel(profile.goal)}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-bold text-[#7F77DD] hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
          >
            <i className="ti ti-edit text-xs" />
            Edit goal
          </button>
        </div>
      </div>

      {/* Stats recap grid (Tinted cards: bg #EEEDFE, no border) */}
      <div className="bg-white border border-[#E8E6FF] rounded-xl p-5 space-y-4">
        <h3 className="text-[11px] font-bold text-lexara-600 uppercase tracking-wider">
          Stats Recap
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#EEEDFE] p-3.5 rounded-xl flex flex-col justify-between min-h-[84px]">
            <span className="text-[10px] font-bold text-lexara-600 uppercase tracking-wider leading-none">
              Streak
            </span>
            <span className="text-[14px] font-bold text-lexara-900 mt-2 flex items-center gap-1 leading-none">
              {profile.currentStreak} days
              <i className="ti ti-flame text-[#7F77DD]" />
            </span>
          </div>
          <div className="bg-[#EEEDFE] p-3.5 rounded-xl flex flex-col justify-between min-h-[84px]">
            <span className="text-[10px] font-bold text-lexara-600 uppercase tracking-wider leading-none">
              Words
            </span>
            <span className="text-[14px] font-bold text-lexara-900 mt-2 flex items-center gap-1 leading-none">
              {profile.totalWords} words
              <i className="ti ti-book-2 text-[#1D9E75]" />
            </span>
          </div>
          <div className="bg-[#EEEDFE] p-3.5 rounded-xl flex flex-col justify-between min-h-[84px]">
            <span className="text-[10px] font-bold text-lexara-600 uppercase tracking-wider leading-none">
              Accuracy
            </span>
            <span className="text-[14px] font-bold text-lexara-900 mt-2 flex items-center gap-1 leading-none">
              {profile.accuracy}%
              <i className="ti ti-checkbox text-[#534AB7]" />
            </span>
          </div>
          <div className="bg-[#EEEDFE] p-3.5 rounded-xl flex flex-col justify-between min-h-[84px]">
            <span className="text-[10px] font-bold text-lexara-600 uppercase tracking-wider leading-none">
              Days Active
            </span>
            <span className="text-[14px] font-bold text-lexara-900 mt-2 flex items-center gap-1 leading-none">
              {profile.totalDays} active
              <i className="ti ti-calendar text-[#BA7517]" />
            </span>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white border border-[#E8E6FF] rounded-xl overflow-hidden divide-y divide-[#E8E6FF]">
        {/* Toggle Notification */}
        <div className="flex items-center justify-between p-4">
          <div className="space-y-0.5">
            <h4 className="text-[12px] font-bold text-lexara-800">
              Daily Notifications
            </h4>
            <p className="text-[10px] font-medium text-zinc-400">
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
            <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7F77DD]" />
          </label>
        </div>

        {/* Reminder Time Input */}
        <div className="flex items-center justify-between p-4">
          <div className="space-y-0.5">
            <h4 className="text-[12px] font-bold text-lexara-800">
              Reminder Time
            </h4>
            <p className="text-[10px] font-medium text-zinc-400">
              Set the time you prefer to study
            </p>
          </div>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="border border-[#E8E6FF] bg-zinc-50 rounded-lg px-2 py-1 text-xs font-bold text-zinc-700 outline-none focus:border-[#7F77DD]"
          />
        </div>

        {/* Account red */}
        <a
          href="https://accounts.lexara.com/user"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 hover:bg-zinc-50/60 transition-colors"
        >
          <div className="space-y-0.5">
            <h4 className="text-[12px] font-bold text-lexara-800">
              Manage Account
            </h4>
            <p className="text-[10px] font-medium text-zinc-400">
              Configure login credentials and details
            </p>
          </div>
          <i className="ti ti-chevron-right text-zinc-400" />
        </a>

        {/* Sign Out Trigger */}
        <div className="p-4 bg-red-50/20 hover:bg-red-50/50 transition-colors">
          <SignOutButton>
            <button className="w-full text-left text-[11px] font-bold text-red-500 uppercase tracking-wider cursor-pointer border-none bg-transparent">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Goal Selector Modal Sheet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-t-2xl md:rounded-2xl p-6 space-y-6 relative border border-[#E8E6FF] animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="text-[15px] font-medium text-lexara-900 leading-none">
                  Update Goal
                </h3>
                <p className="text-[10px] font-semibold text-zinc-400 mt-1">
                  Choose your active vocabulary focus
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg cursor-pointer border-none bg-transparent"
              >
                <i className="ti ti-x leading-none" />
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
                      "w-full text-left flex items-center p-3 rounded-xl border transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#EEEDFE] border-2 border-[#7F77DD] p-[11px]"
                        : "bg-white border border-[#E8E6FF] hover:bg-zinc-50"
                    )}
                  >
                    {/* IconBox context-colored badge */}
                    <div className="mr-3">
                      <IconBox context={goal.context} icon={goal.icon} size="sm" />
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "text-[12px] font-bold",
                          isSelected ? "text-[#7F77DD]" : "text-lexara-800"
                        )}
                      >
                        {goal.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-medium">
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
      <div className="h-48 bg-zinc-200 rounded-xl" />
      <div className="h-40 bg-zinc-200 rounded-xl" />
      <div className="h-56 bg-zinc-200 rounded-xl" />
    </div>
  );
}

function ProfileError() {
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
          We couldn't load your profile page. Try again.
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
