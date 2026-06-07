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

  // Helper to extract HSL hue deterministically for custom bar styling
  const getAvatarHue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  };

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return <LeaderboardError />;
  }

  const podiumItems = leaderboard.slice(0, 3);

  // visual order: [2nd, 1st, 3rd]
  const orderedPodium = [];
  if (podiumItems[1]) orderedPodium.push({ ...podiumItems[1], rank: 2 });
  if (podiumItems[0]) orderedPodium.push({ ...podiumItems[0], rank: 1 });
  if (podiumItems[2]) orderedPodium.push({ ...podiumItems[2], rank: 3 });

  return (
    <div className="space-y-6 font-sans select-none text-lexara-900">
      {/* Tab Switcher */}
      <div className="flex border-b border-[#E8E6FF]">
        <button
          onClick={() => setActiveTab("friends")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-extrabold transition-all border-b-2 cursor-pointer",
            activeTab === "friends"
              ? "border-[#7F77DD] text-[#7F77DD]"
              : "border-transparent text-zinc-400 hover:text-zinc-500"
          )}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={cn(
            "flex-1 py-3 text-center text-sm font-extrabold transition-all border-b-2 cursor-pointer",
            activeTab === "global"
              ? "border-[#7F77DD] text-[#7F77DD]"
              : "border-transparent text-zinc-400 hover:text-zinc-500"
          )}
        >
          Global
        </button>
      </div>

      {activeTab === "global" ? (
        <div className="bg-white border border-[#E8E6FF] p-8 rounded-xl text-center space-y-3">
          <div className="flex justify-center">
            <IconBox context="info" icon="ti-world" size="md" />
          </div>
          <h3 className="text-[12px] font-bold text-lexara-900">Global Leaderboard</h3>
          <p className="text-[10px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Coming soon: Compete globally with language learners from all over the world.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Week period subtitle */}
          <div className="text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Weekly Period
            </p>
            <p className="text-[11px] font-extrabold text-lexara-800 mt-0.5">
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
                
                const hue = getAvatarHue(player.name);
                const barBg = `hsl(${hue}, 65%, 93%)`;
                const barBorder = `1px solid hsl(${hue}, 65%, 82%)`;
                
                return (
                  <div
                    key={player.id}
                    className="flex flex-col items-center flex-1 max-w-[100px] text-center"
                  >
                    {/* User profile avatar */}
                    <div className="relative">
                      {isFirst && (
                        <i className="ti ti-crown text-[#BA7517] text-lg animate-bounce block mb-1.5 leading-none" />
                      )}
                      <Avatar
                        name={player.name}
                        imageUrl={player.imageUrl}
                        size={isFirst ? "lg" : "md"}
                        className={cn(isMe ? "border-[#7F77DD]" : "border-white")}
                      />
                      <div
                        className={cn(
                          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white",
                          isFirst
                            ? "bg-[#BA7517]"
                            : isSecond
                            ? "bg-zinc-400"
                            : "bg-amber-700"
                        )}
                      >
                        {player.rank}
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-lexara-800 mt-4 truncate w-full px-1">
                      {player.name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-400 mt-0.5 flex items-center justify-center gap-0.5">
                      {player.streak}
                      <i className="ti ti-flame text-[#7F77DD] text-[10px]" />
                    </span>

                    {/* Dynamic Podium Column Bar */}
                    <div
                      style={{
                        backgroundColor: barBg,
                        border: barBorder,
                        borderBottom: "none",
                      }}
                      className={cn(
                        "w-full rounded-t-xl mt-3 flex flex-col justify-end p-2 transition-all",
                        isFirst ? "h-24" : isSecond ? "h-18" : "h-14"
                      )}
                    >
                      <span className="text-xs font-black text-[#534AB7]">
                        {player.weeklyXP}
                      </span>
                      <span className="text-[8px] font-black text-lexara-600 uppercase tracking-wider mt-0.5">
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
            <div className="bg-white border border-[#E8E6FF] p-8 rounded-xl text-center space-y-4">
              <p className="text-[11px] font-semibold text-zinc-500">
                Add friends to see how you compare.
              </p>
              <Link
                href="/friends"
                className="inline-block px-5 py-2 bg-[#7F77DD] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider"
              >
                Add Friends
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E6FF] rounded-xl overflow-hidden divide-y divide-[#E8E6FF]">
              {leaderboard.map((player, index) => {
                const isMe = player.id === currentUserId;
                const rank = index + 1;
                
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "flex items-center justify-between p-4 transition-colors",
                      isMe ? "bg-[#F8F7FF] rounded-lg border-2 border-[#E8E6FF] m-1 p-[14px]" : "bg-transparent"
                    )}
                  >
                    {/* Left Rank details */}
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center text-xs font-black text-zinc-400">
                        {rank}
                      </span>
                      <Avatar name={player.name} imageUrl={player.imageUrl} size="sm" />
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isMe ? "text-[#7F77DD]" : "text-lexara-900"
                          )}
                        >
                          {player.name}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-0.5 mt-0.5">
                          {player.streak} day streak
                          <i className="ti ti-flame text-[#7F77DD] text-xs leading-none" />
                        </span>
                      </div>
                    </div>

                    {/* Right XP details */}
                    <div className="text-right">
                      <span className="text-xs font-black text-lexara-800">
                        {player.weeklyXP}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400 block uppercase tracking-wide">
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
        <div className="h-10 flex-1 bg-zinc-200 rounded-lg" />
        <div className="h-10 flex-1 bg-zinc-200 rounded-lg" />
      </div>
      <div className="h-44 bg-zinc-200 rounded-xl" />
      <div className="h-32 bg-zinc-200 rounded-xl" />
    </div>
  );
}

function LeaderboardError() {
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
          We couldn't load the leaderboard. Try again.
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
