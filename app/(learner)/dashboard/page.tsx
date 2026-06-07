"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StreakDisplay } from "@/components/streak-display";
import { StatCard } from "@/components/stat-card";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

interface StatsData {
  streak: number;
  wordCount: number;
  rank: number;
  accuracy: number;
}

interface FriendActivity {
  id: string;
  name: string;
  imageUrl: string | null;
  streak: number;
  weeklyXP: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState<boolean | null>(null);
  const [friends, setFriends] = useState<FriendActivity[]>([]);
  const [userName, setUserName] = useState<string>("Learner");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(false);

        // Fetch User Stats
        const statsRes = await fetch("/api/user/stats");
        if (!statsRes.ok) throw new Error("Failed to load stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch Daily Words status
        const wordsRes = await fetch("/api/words");
        if (!wordsRes.ok) throw new Error("Failed to load words");
        const wordsData = await wordsRes.json();
        setSessionCompleted(!!wordsData.alreadyCompleted);

        // Fetch Leaderboard for friends activity strip
        const leaderboardRes = await fetch("/api/leaderboard");
        if (leaderboardRes.ok) {
          const lbData = await leaderboardRes.json();
          const currentUserId = lbData.currentUserId;
          const friendsOnly = lbData.leaderboard.filter(
            (item: any) => item.id !== currentUserId
          );
          setFriends(friendsOnly.slice(0, 5));
          
          const me = lbData.leaderboard.find((item: any) => item.id === currentUserId);
          if (me) {
            setUserName(me.name);
          }
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = userName ? userName.split(" ")[0] : "Learner";
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 17) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError />;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Top bar */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-[15px] font-medium text-lexara-900 leading-tight">
            {getGreeting()}
          </h1>
          <p className="text-[11px] text-lexara-600 mt-0.5">
            Ready for your vocabulary boost?
          </p>
        </div>
        {stats && <StreakDisplay count={stats.streak} size="md" />}
      </div>

      {/* Today's session card (Card bg: #FFFFFF with border: 1px solid #E8E6FF) */}
      <div className="bg-white border border-[#E8E6FF] p-6 rounded-xl relative select-none">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-[15px] font-medium text-lexara-900 leading-none">
              Today's session
            </h2>
            <p className="text-[11px] text-lexara-600 mt-1">
              5 words · ~4 min
            </p>
          </div>
          
          {/* Progress badge */}
          {sessionCompleted ? (
            <span className="bg-[#E1F5EE] text-[#1D9E75] border border-[#E1F5EE] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <i className="ti ti-check text-[10px]" />
              Completed
            </span>
          ) : (
            <span className="bg-lexara-100 text-lexara-600 border border-lexara-100 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Ready
            </span>
          )}
        </div>

        {/* Learn button or Completed banner */}
        <div className="mt-6">
          {sessionCompleted ? (
            <div className="w-full bg-[#1D9E75] text-white py-[11px] rounded-xl text-[13px] font-medium flex items-center justify-center gap-2">
              <span>All daily words checked!</span>
              <i className="ti ti-circle-check text-sm" />
            </div>
          ) : (
            <Link
              href="/learn"
              className="block w-full bg-[#7F77DD] hover:opacity-95 text-white py-[11px] rounded-xl text-[13px] font-medium text-center tracking-wide uppercase transition-all"
            >
              Start learning
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
          Your Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {stats && (
            <>
              <StatCard
                value={`${stats.streak} days`}
                label="Current Streak"
                icon="ti-flame"
                context="streak"
              />
              <StatCard
                value={stats.wordCount}
                label="Words Learned"
                icon="ti-book-2"
                context="progress"
              />
              <StatCard
                value={`#${stats.rank}`}
                label="Leaderboard Rank"
                icon="ti-trophy"
                context="trophy"
              />
              <StatCard
                value={`${stats.accuracy}%`}
                label="Accuracy"
                icon="ti-checkbox"
                context="info"
              />
            </>
          )}
        </div>
      </div>

      {/* Friends Activity Strip */}
      <div className="space-y-2 select-none">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Friends
          </h3>
          <Link
            href="/leaderboard"
            className="text-[11px] font-bold text-lexara-500 hover:underline"
          >
            Leaderboard
          </Link>
        </div>

        {friends.length === 0 ? (
          <div className="bg-white border border-[#E8E6FF] rounded-xl p-6 text-center">
            <p className="text-[11px] font-semibold text-lexara-600">
              No friends active this week. Compare rankings on the leaderboard.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {friends.map((friend) => (
              <Link
                key={friend.id}
                href="/leaderboard"
                className="flex flex-col items-center flex-shrink-0 bg-white border border-[#E8E6FF] p-3 rounded-xl min-w-[84px] snap-center hover:bg-zinc-50/60 transition-all"
              >
                <Avatar name={friend.name} imageUrl={friend.imageUrl} size="sm" />
                <span className="text-[10px] font-bold text-lexara-800 mt-2 truncate w-16 text-center">
                  {friend.name.split(" ")[0]}
                </span>
                <span className="text-[10px] font-extrabold text-lexara-500 flex items-center gap-0.5 mt-0.5">
                  {friend.streak}
                  <i className="ti ti-flame text-xs leading-none" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-zinc-200 rounded-lg" />
          <div className="h-3 w-32 bg-zinc-200 rounded-lg" />
        </div>
        <div className="w-14 h-14 bg-zinc-200 rounded-full" />
      </div>

      {/* Session Card */}
      <div className="h-40 bg-zinc-200 rounded-xl" />

      {/* Stats Grid */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-zinc-200 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 bg-zinc-200 rounded-xl" />
          <div className="h-24 bg-zinc-200 rounded-xl" />
          <div className="h-24 bg-zinc-200 rounded-xl" />
          <div className="h-24 bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function DashboardError() {
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
          We couldn't load your dashboard. Try reloading the page.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 bg-[#7F77DD] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider"
      >
        Try again
      </button>
    </div>
  );
}
