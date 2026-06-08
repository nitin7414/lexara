"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

interface StatsData {
  streak: number;
  longestStreak: number;
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

        // Fetch Leaderboard for friends activity
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
    <div className="relative z-10 w-full min-h-screen text-on-background font-sans select-none pb-12">
      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[35%] -right-[5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight text-on-background">
            {getGreeting()}
          </h1>
          <p className="text-on-surface-variant text-base">
            Your {stats?.streak || 0}-day learning streak is going strong!
          </p>
        </section>

        {/* Main 12-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Main Content Column (8/12) */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Words of the Day (Bento Card) */}
            <div className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 shadow-xl shadow-black/25 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="icon-box bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">Words of the Day</h2>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full border border-outline-variant/5">
                  {sessionCompleted ? "0 New Words" : "5 New Words"}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 py-4 px-2">
                {/* Connecting Line */}
                <div className="absolute top-[32px] left-[40px] right-[40px] h-[3px] bg-surface-container-highest hidden sm:block z-0" />
                
                {/* Step 1: Introduce */}
                <div className="relative z-10 flex flex-col items-center gap-2 group">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    sessionCompleted 
                      ? "bg-secondary text-on-secondary shadow-secondary/20 scale-100" 
                      : "bg-primary text-on-primary shadow-primary/30 border-4 border-primary/30 animate-pulse scale-105"
                  )}>
                    <span className="material-symbols-outlined text-[32px]">
                      {sessionCompleted ? "check_circle" : "play_arrow"}
                    </span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold tracking-wide",
                    sessionCompleted ? "text-secondary" : "text-primary font-bold"
                  )}>
                    Introduce
                  </span>
                </div>

                {/* Step 2: Practice */}
                <div className={cn(
                  "relative z-10 flex flex-col items-center gap-2 group transition-opacity duration-300",
                  !sessionCompleted && "opacity-40"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    sessionCompleted 
                      ? "bg-secondary text-on-secondary shadow-secondary/20" 
                      : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/10"
                  )}>
                    <span className="material-symbols-outlined text-[32px]">
                      {sessionCompleted ? "check_circle" : "lock"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-on-surface-variant">
                    Practice
                  </span>
                </div>

                {/* Step 3: Test */}
                <div className={cn(
                  "relative z-10 flex flex-col items-center gap-2 group transition-opacity duration-300",
                  !sessionCompleted && "opacity-40"
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    sessionCompleted 
                      ? "bg-secondary text-on-secondary shadow-secondary/20" 
                      : "bg-surface-container-highest text-on-surface-variant border border-outline-variant/10"
                  )}>
                    <span className="material-symbols-outlined text-[32px]">
                      {sessionCompleted ? "check_circle" : "lock"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-on-surface-variant">
                    Test
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-6">
                {sessionCompleted ? (
                  <div className="w-full bg-secondary-container/20 border border-secondary-container/30 text-secondary py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 select-none">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>All daily words checked!</span>
                  </div>
                ) : (
                  <Link
                    href="/learn"
                    className="block w-full bg-primary hover:brightness-110 text-on-primary py-3.5 rounded-xl font-bold text-sm text-center shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </div>

            {/* Secondary Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Quick Practice Card */}
              <Link href="/learn" className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 hover:bg-surface-container-high transition-colors cursor-pointer group shadow-lg shadow-black/10 block">
                <div className="icon-box bg-secondary/10 text-secondary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <h3 className="text-lg font-bold mb-1 text-on-surface">Quick Practice</h3>
                <p className="text-on-surface-variant text-sm">Refresh your recent mistakes in 2 minutes.</p>
              </Link>

              {/* Flashcards Card */}
              <Link href="/learn" className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 hover:bg-surface-container-high transition-colors cursor-pointer group shadow-lg shadow-black/10 block">
                <div className="icon-box bg-tertiary/10 text-tertiary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">style</span>
                </div>
                <h3 className="text-lg font-bold mb-1 text-on-surface">Flashcards</h3>
                <p className="text-on-surface-variant text-sm">Review 45 cards due for spaced repetition.</p>
              </Link>

              {/* Word Battle Arena Card (Full-width in grid) */}
              <Link href="/battle" className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 hover:bg-surface-container-high transition-colors cursor-pointer group shadow-lg shadow-black/10 block sm:col-span-2 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="icon-box bg-primary/10 text-primary group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-[24px]">swords</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                        Word Battle Arena
                        <span className="bg-secondary/15 text-secondary border border-secondary/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          PvP Live
                        </span>
                      </h3>
                      <p className="text-on-surface-variant text-sm mt-0.5">Compete against other learners in real-time vocabulary duels.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-0.5 shrink-0 self-end sm:self-center">
                    Enter Arena <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar Column (4/12) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Daily Goal Card */}
            <div className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Daily Goal</h3>
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-primary">
                  {sessionCompleted ? "5" : "0"}
                  <span className="text-on-surface-variant text-sm font-medium">/5</span>
                </div>
                <span className="text-xs font-semibold text-secondary">
                  {sessionCompleted ? "100%" : "0%"} complete
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full rounded-full transition-all duration-700" 
                  style={{ width: sessionCompleted ? "100%" : "0%" }} 
                />
              </div>
              <p className="mt-3.5 text-xs text-on-surface-variant italic font-medium">
                {sessionCompleted ? "All caught up for today!" : "5 more words to hit your goal!"}
              </p>
            </div>

            {/* Daily Quests Card */}
            <div className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 shadow-lg shadow-black/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box bg-tertiary/10 text-tertiary">
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <h3 className="text-sm font-bold text-on-surface">Daily Quests</h3>
              </div>
              
              <div className="space-y-4">
                {/* Quest 1 */}
                <div className={cn("flex items-center gap-3", !sessionCompleted && "opacity-80")}>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-semibold text-on-surface">Complete Daily Words</span>
                      <span className="text-xs font-bold text-on-surface">{sessionCompleted ? "5/5" : "0/5"}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: sessionCompleted ? "100%" : "0%" }} 
                      />
                    </div>
                  </div>
                  <div className={cn("text-tertiary transition-transform duration-300", sessionCompleted && "scale-110")}>
                    <span className="material-symbols-outlined">stars</span>
                  </div>
                </div>

                {/* Quest 2 */}
                <div className={cn("flex items-center gap-3", (!stats || stats.streak === 0) && "opacity-40")}>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-semibold text-on-surface">Maintain Streak</span>
                      <span className="text-xs font-bold text-on-surface">{stats && stats.streak > 0 ? "1/1" : "0/1"}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all duration-500" 
                        style={{ width: stats && stats.streak > 0 ? "100%" : "0%" }} 
                      />
                    </div>
                  </div>
                  <div className="text-tertiary">
                    <span className="material-symbols-outlined">stars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Streak Counter Card */}
            <div className="bg-surface-container-highest/50 border border-tertiary/10 rounded-2xl p-6 flex items-center gap-4 shadow-lg shadow-tertiary/5 backdrop-blur-sm">
              <div className="icon-box bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20 w-12 h-12 shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
              <div>
                <div className="text-lg font-bold text-on-surface">{stats?.streak || 0} Day Streak</div>
                <div className="text-xs font-semibold text-tertiary">Personal Record: {stats?.longestStreak || 0} days</div>
              </div>
            </div>

            {/* Promo / Visual Card */}
            <div className="relative overflow-hidden rounded-2xl h-48 bg-surface-container flex items-end p-5 group shadow-lg">
              <img 
                alt="Learning background" 
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 pointer-events-none" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBng2P5yPDl6vS7B6vvE_BsrtSwt-R1pD6Q9su2rhTuzN1cXU4xzAb40RZRXHcMYBzWhTuXy2-a8lPyaCp8_d5ZLJUb3zGtAu2-Dkw8TEw10IiC_8GvffVuMe6Md8RPeed0xoN6svttab1bEbB-UAtW5FoBwwJqkwydwf1Vart0-PFwoXWzt_NnU2mmARxklrs0DuD_ccfe-9368fWH3_hkoorc0PBh18BhWQyGjeHhI6AviNsCHGMszNWKlZQoI7hRrX1WQ34SPK4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="bg-primary text-on-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 inline-block">Pro Tip</span>
                <h4 className="text-on-primary font-bold text-lg leading-tight">Master idioms with Lexara AI</h4>
              </div>
            </div>

            {/* Friends Activity Strip */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest">
                  Friends Activity
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Leaderboard
                </Link>
              </div>

              {friends.length === 0 ? (
                <div className="bg-surface-container-low/95 border border-outline-variant/10 rounded-2xl p-6 text-center shadow-md">
                  <p className="text-xs text-on-surface-variant">
                    No friends active this week. Compare rankings on the leaderboard.
                  </p>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                  {friends.map((friend) => (
                    <Link
                      key={friend.id}
                      href="/leaderboard"
                      className="flex flex-col items-center flex-shrink-0 bg-surface-container-low border border-outline-variant/10 p-3 rounded-2xl min-w-[84px] snap-center hover:bg-surface-container transition-all shadow-sm"
                    >
                      <Avatar name={friend.name} imageUrl={friend.imageUrl} size="sm" />
                      <span className="text-[10px] font-semibold text-on-surface mt-2 truncate w-16 text-center">
                        {friend.name.split(" ")[0]}
                      </span>
                      <span className="text-[10px] font-extrabold text-tertiary flex items-center gap-0.5 mt-0.5">
                        {friend.streak}
                        <i className="ti ti-flame text-xs leading-none" />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse select-none pb-12">
      {/* Welcome Section Skeleton */}
      <div className="space-y-3">
        <div className="h-9 w-64 bg-surface-container-low rounded-lg" />
        <div className="h-4 w-80 bg-surface-container-low rounded-lg" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="h-[280px] bg-surface-container-low rounded-2xl border border-outline-variant/5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-[140px] bg-surface-container-low rounded-2xl" />
            <div className="h-[140px] bg-surface-container-low rounded-2xl" />
            <div className="h-[100px] sm:col-span-2 bg-surface-container-low rounded-2xl" />
          </div>
        </div>
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="h-[140px] bg-surface-container-low rounded-2xl" />
          <div className="h-[180px] bg-surface-container-low rounded-2xl" />
          <div className="h-[80px] bg-surface-container-low rounded-2xl" />
          <div className="h-[192px] bg-surface-container-low rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function DashboardError() {
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto select-none text-on-surface shadow-xl">
      <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto shadow-sm">
        <span className="material-symbols-outlined text-[24px]">warning</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-on-surface">
          Something went wrong.
        </h3>
        <p className="text-xs text-on-surface-variant">
          We couldn't load your dashboard. Try reloading the page.
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
