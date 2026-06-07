"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

interface LeaderboardItem {
  id: string;
  clerkId: string;
  name: string;
  imageUrl: string | null;
  streak: number;
  weeklyXP: number;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "global">("friends");
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setCurrentUserId(data.currentUserId);
      } catch (err) {
        console.error("Leaderboard page fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // Compute dates for "This Week" (current Monday to Sunday)
  const getWeekRangeString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${monday.toLocaleDateString("en-US", options)} – ${sunday.toLocaleDateString("en-US", options)}`;
  };

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return <LeaderboardError />;
  }

  // Split out podium and list items
  const podiumItems = leaderboard.slice(0, 3);
  const listItems = leaderboard.slice(3);

  // Reorder podium as [2nd, 1st, 3rd] for visual display
  const orderedPodium = [];
  if (podiumItems[1]) orderedPodium.push({ ...podiumItems[1], rank: 2 });
  if (podiumItems[0]) orderedPodium.push({ ...podiumItems[0], rank: 1 });
  if (podiumItems[2]) orderedPodium.push({ ...podiumItems[2], rank: 3 });

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("friends")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-extrabold transition-all border-b-2 cursor-pointer",
            activeTab === "friends"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600"
          )}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-extrabold transition-all border-b-2 cursor-pointer",
            activeTab === "global"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-600"
          )}
        >
          Global
        </button>
      </div>

      {activeTab === "global" ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl text-center space-y-2">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto">
            <i className="ti ti-world text-xl" />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Global Leaderboard</h3>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            Coming soon: Compete globally with language learners from all over the world.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Week period subtitle */}
          <div className="text-center">
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              Weekly Period
            </p>
            <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 mt-0.5">
              {getWeekRangeString()}
            </p>
          </div>

          {/* Podium (Top 3) */}
          {podiumItems.length > 0 && (
            <div className="flex items-end justify-center gap-2 pt-6 pb-2 min-h-[220px]">
              {/* Podium Column Render */}
              {orderedPodium.map((player) => {
                const isMe = player.id === currentUserId;
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;
                
                return (
                  <div
                    key={player.id}
                    className="flex flex-col items-center flex-1 max-w-[100px] text-center"
                  >
                    {/* User profile avatar with float effect */}
                    <div className="relative">
                      {isFirst && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xl animate-bounce">
                          👑
                        </div>
                      )}
                      <Avatar
                        name={player.name}
                        imageUrl={player.imageUrl}
                        size={isFirst ? "lg" : "md"}
                        className={cn(
                          isMe ? "border-primary ring-2 ring-primary/30" : "border-white"
                        )}
                      />
                      <div
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white",
                          isFirst
                            ? "bg-warning"
                            : isSecond
                            ? "bg-zinc-400"
                            : "bg-amber-700"
                        )}
                      >
                        {player.rank}
                      </div>
                    </div>

                    <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-300 mt-4 truncate w-full px-1">
                      {player.name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 flex items-center justify-center gap-0.5">
                      {player.streak}🔥
                    </span>

                    {/* Podium base block */}
                    <div
                      className={cn(
                        "w-full rounded-t-xl mt-3 flex flex-col justify-end p-2 transition-all",
                        isFirst
                          ? "h-24 bg-primary-light border-t border-primary/20"
                          : isSecond
                          ? "h-18 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
                          : "h-14 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      <span className="text-xs font-black text-primary-dark dark:text-primary">
                        {player.weeklyXP}
                      </span>
                      <span className="text-[8px] font-black text-primary/70 dark:text-zinc-500 uppercase tracking-wider mt-0.5">
                        XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Leaderboard list */}
          {leaderboard.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl text-center space-y-4">
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Add friends to see how you compare.
              </p>
              <Link
                href="/friends"
                className="inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg uppercase tracking-wider"
              >
                Add Friends
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {leaderboard.map((player, index) => {
                const isMe = player.id === currentUserId;
                const rank = index + 1;
                
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center justify-between p-4 transition-colors",
                      isMe ? "bg-primary-light/40" : "bg-transparent"
                    )}
                  >
                    {/* Left block (Rank + Avatar + Name) */}
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-black text-zinc-400 dark:text-zinc-500">
                        {rank}
                      </span>
                      <Avatar name={player.name} imageUrl={player.imageUrl} size="sm" />
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-xs font-extrabold",
                            isMe ? "text-primary-dark dark:text-primary" : "text-zinc-900 dark:text-zinc-100"
                          )}
                        >
                          {player.name}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5 mt-0.5">
                          {player.streak} day streak 🔥
                        </span>
                      </div>
                    </div>

                    {/* Right block (XP) */}
                    <div className="text-right">
                      <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                        {player.weeklyXP}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 block uppercase tracking-wide">
                        XP this week
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="flex gap-4">
        <div className="h-10 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="h-10 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg mx-auto" />

      {/* Podium skeleton */}
      <div className="flex items-end justify-center gap-4 pt-6">
        <div className="h-32 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-t-xl" />
        <div className="h-44 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-t-xl" />
        <div className="h-28 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-t-xl" />
      </div>

      {/* List skeleton */}
      <div className="space-y-2">
        <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

function LeaderboardError() {
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
          We couldn't load the leaderboard. Try again.
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
