"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { IconBox } from "@/components/icon-box";
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

  const getWeekRangeString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
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

  const podiumItems = leaderboard.slice(0, 3);

  // Visual layout order: [2nd, 1st, 3rd]
  const orderedPodium = [];
  if (podiumItems[1]) orderedPodium.push({ ...podiumItems[1], rank: 2 });
  if (podiumItems[0]) orderedPodium.push({ ...podiumItems[0], rank: 1 });
  if (podiumItems[2]) orderedPodium.push({ ...podiumItems[2], rank: 3 });

  return (
    <div className="space-y-6 font-sans select-none text-on-surface">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <h1 className="text-xl font-bold tracking-tight">Social Arena</h1>
        {/* Tab Switcher */}
        <div className="flex bg-surface-container p-1 rounded-xl w-fit border border-outline-variant/35">
          <button
            onClick={() => setActiveTab("friends")}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border-none",
              activeTab === "friends"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border-none",
              activeTab === "global"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            Global
          </button>
        </div>
      </div>

      {activeTab === "global" ? (
        <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-2xl text-center space-y-3">
          <div className="flex justify-center">
            <IconBox context="info" icon="ti-world" size="md" />
          </div>
          <h3 className="text-xs font-bold text-on-surface">Global Leaderboard</h3>
          <p className="text-[10px] text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Coming soon: Compete globally with language learners from all over the world.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Week period subtitle */}
          <div className="text-center">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Weekly Period
            </p>
            <p className="text-[11px] font-extrabold text-on-surface mt-0.5">
              {getWeekRangeString()}
            </p>
          </div>

          {/* Podium (Top 3) */}
          {podiumItems.length > 0 && (
            <div className="flex items-end justify-center gap-2 pt-6 pb-2 min-h-[220px]">
              {orderedPodium.map((player) => {
                const isMe = player.id === currentUserId;
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;

                return (
                  <div
                    key={player.id}
                    className="flex flex-col items-center flex-1 max-w-[100px] text-center"
                  >
                    {/* User profile avatar */}
                    <div className="relative">
                      {isFirst && (
                        <i className="ti ti-crown text-tertiary text-lg animate-bounce block mb-1.5 leading-none" />
                      )}
                      <Avatar
                        name={player.name}
                        imageUrl={player.imageUrl}
                        size={isFirst ? "lg" : "md"}
                        className={cn(isMe ? "border-primary" : "border-outline-variant/30")}
                      />
                      <div
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-outline-variant/35",
                          isFirst
                            ? "bg-tertiary"
                            : isSecond
                            ? "bg-zinc-400"
                            : "bg-amber-700"
                        )}
                      >
                        {player.rank}
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-on-surface mt-4 truncate w-full px-1">
                      {player.name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-semibold text-on-surface-variant mt-0.5 flex items-center justify-center gap-0.5">
                      {player.streak}
                      <i className="ti ti-flame text-tertiary text-[10px]" />
                    </span>

                    {/* Dynamic Podium Column Bar */}
                    <div
                      className={cn(
                        "w-full rounded-t-xl mt-3 flex flex-col justify-end p-2 transition-all border border-b-0 border-outline-variant/10",
                        isFirst
                          ? "h-24 bg-primary-container/20 border-primary/20 backdrop-blur-sm"
                          : "h-18 bg-surface-container/30",
                        isSecond ? "h-18" : "h-14"
                      )}
                    >
                      <span className="text-xs font-black text-primary">
                        {player.weeklyXP}
                      </span>
                      <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-wider mt-0.5">
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
            <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-2xl text-center space-y-4">
              <p className="text-[11px] font-semibold text-on-surface-variant">
                Add friends to see how you compare.
              </p>
              <Link
                href="/friends"
                className="inline-block px-5 py-2 bg-primary text-on-primary text-[11px] font-bold rounded-lg uppercase tracking-wider border-none"
              >
                Add Friends
              </Link>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl overflow-hidden divide-y divide-outline-variant/10">
              {leaderboard.map((player, index) => {
                const isMe = player.id === currentUserId;
                const rank = index + 1;
                
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center justify-between p-4 transition-colors",
                      isMe
                        ? "bg-primary-container text-on-primary-container border-2 border-primary/20 m-1 rounded-xl p-[14px]"
                        : "bg-transparent hover:bg-surface-container-low"
                    )}
                  >
                    {/* Left Rank details */}
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-black text-on-surface-variant">
                        {rank}
                      </span>
                      <Avatar name={player.name} imageUrl={player.imageUrl} size="sm" />
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isMe ? "text-on-primary-container" : "text-on-surface"
                          )}
                        >
                          {player.name}
                        </span>
                        <span className="text-[10px] font-semibold text-on-surface-variant/80 flex items-center gap-0.5 mt-0.5">
                          {player.streak} day streak
                          <i className="ti ti-flame text-tertiary text-xs leading-none" />
                        </span>
                      </div>
                    </div>

                    {/* Right XP details */}
                    <div className="text-right">
                      <span className={cn(
                        "text-xs font-black",
                        isMe ? "text-on-primary-container" : "text-on-surface"
                      )}>
                        {player.weeklyXP}
                      </span>
                      <span className="text-[9px] font-bold text-on-surface-variant/85 block uppercase tracking-wide">
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
        <div className="h-10 flex-1 bg-surface-container rounded-lg" />
        <div className="h-10 flex-1 bg-surface-container rounded-lg" />
      </div>
      <div className="h-44 bg-surface-container rounded-xl" />
      <div className="h-32 bg-surface-container rounded-xl" />
    </div>
  );
}

function LeaderboardError() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 p-8 rounded-2xl text-center space-y-4 font-sans select-none text-on-surface">
      <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
        <i className="ti ti-alert-triangle text-xl" />
      </div>
      <div className="space-y-1">
        <h3 className="text-[12px] font-bold text-on-surface">
          Something went wrong.
        </h3>
        <p className="text-[10px] text-on-surface-variant">
          We couldn't load the leaderboard. Try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-lg uppercase tracking-wider border-none cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
