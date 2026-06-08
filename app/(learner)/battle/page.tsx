"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

const SEARCH_MESSAGES = [
  "Finding Opponent...",
  "Analyzing Skills...",
  "Matching Latency...",
  "Preparing Arena...",
  "Almost there..."
];

export default function BattleLobbyPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(true);
  const [searchMsgIndex, setSearchMsgIndex] = useState(0);
  const [opponentFound, setOpponentFound] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simulated opponent state
  const [opponent, setOpponent] = useState({
    name: "Finding Opponent...",
    title: "Avg. Wait: 0:12s",
    level: 0,
    imageUrl: null as string | null
  });

  // Cycle searching messages
  useEffect(() => {
    if (!isSearching || opponentFound) return;
    const msgInterval = setInterval(() => {
      setSearchMsgIndex((prev) => (prev + 1) % SEARCH_MESSAGES.length);
    }, 2500);
    return () => clearInterval(msgInterval);
  }, [isSearching, opponentFound]);

  // Simulate matchmaking process
  useEffect(() => {
    if (!isSearching) return;

    // After 6 seconds, simulate finding an opponent
    const matchTimeout = setTimeout(() => {
      setOpponentFound(true);
      setOpponent({
        name: "Amara Vance",
        title: "Greek Roots Specialist",
        level: 45,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq7LRlp4YpxAl-W_hFyqPKe-AiPeuiqNNjkZZVZ0R6Dz5bI_46bHHk3OYrw3tU5OhnezNISMG6BPLX7UhJEDTLjMqc1kLV79NW2Cl_ErM4pGvupfocrQ-SyhbbfIRSSC4QDxpvpgPWlnr9SlnC_w8GIJxy_ssEltSizgo3nqPo7RAtiQiMQtcVgkjaJHqOtdEPHwH8m3ExqMA36sndY7fYzTM0CBFVggSiPX8VMVuQJ4yjaKQM9J4KvJx1j_Z6ei70isZoaWyg2uM"
      });
      setCountdown(3);
    }, 6000);

    return () => clearTimeout(matchTimeout);
  }, [isSearching]);

  // Countdown timer once opponent is found
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // Redirect to live duel
      router.push("/battle/live");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleCancel = () => {
    setIsSearching(false);
    setOpponentFound(false);
    setCountdown(null);
    setOpponent({
      name: "Matchmaking Stopped",
      title: "Queue is inactive",
      level: 0,
      imageUrl: null
    });
  };

  const handleStartSearch = () => {
    setIsSearching(true);
    setOpponentFound(false);
    setCountdown(null);
    setOpponent({
      name: "Finding Opponent...",
      title: "Avg. Wait: 0:12s",
      level: 0,
      imageUrl: null
    });
  };

  return (
    <div className="space-y-10 text-[#e1e4ff] select-none font-sans pb-16">
      {/* Search Pulse Glow */}
      {isSearching && (
        <div className="absolute inset-x-0 top-36 pointer-events-none -z-10 flex justify-center">
          <div className="w-[380px] h-[220px] matchmaking-glow opacity-30 rounded-full" />
        </div>
      )}

      {/* Matchmaking Section */}
      <section className="relative w-full py-8 flex flex-col items-center justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 w-full max-w-2xl">
          {/* Current User */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-2xl neo-raised p-1 flex items-center justify-center relative">
              <div className="w-full h-full rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center">
                <Avatar name="Alex Mercer" size="xl" className="border-none w-full h-full rounded-none" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                LVL 42
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-on-surface">Alex Mercer</h3>
              <p className="text-[10px] text-on-surface-variant">Master of Verbose</p>
            </div>
          </div>

          {/* VS Center */}
          <div className="relative flex flex-col items-center min-w-[120px]">
            <div className="text-5xl font-black vs-gradient italic tracking-tighter">VS</div>
            <div className="mt-4 flex flex-col items-center gap-1.5 min-h-[40px] justify-center">
              {countdown !== null ? (
                <div className="text-center">
                  <span className="text-xs font-bold text-tertiary uppercase tracking-widest block">MATCH STARTING</span>
                  <span className="text-2xl font-black text-white animate-ping block mt-1">{countdown}</span>
                </div>
              ) : isSearching ? (
                <>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase transition-opacity duration-300">
                    {SEARCH_MESSAGES[searchMsgIndex]}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                  WAITING IN LOBBY
                </span>
              )}
            </div>
          </div>

          {/* Opponent Placeholder / Active Opponent */}
          <div className={cn("flex flex-col items-center gap-3 transition-opacity", !isSearching && "opacity-50")}>
            {opponent.imageUrl ? (
              <div className="w-28 h-28 rounded-2xl neo-raised p-1 flex items-center justify-center relative border border-primary/20">
                <div className="w-full h-full rounded-xl overflow-hidden bg-surface-container-high">
                  <img src={opponent.imageUrl} alt={opponent.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-tertiary text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                  LVL {opponent.level}
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl neo-inset flex items-center justify-center">
                <i className={cn("ti ti-user-search text-3xl text-outline-variant", isSearching && "animate-pulse")} />
              </div>
            )}
            <div className="text-center">
              <h3 className="text-sm font-bold text-on-surface">{opponent.name}</h3>
              <p className="text-[10px] text-on-surface-variant">{opponent.title}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          {isSearching ? (
            <button
              onClick={handleCancel}
              className="neo-raised px-8 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-none"
            >
              <i className="ti ti-circle-x" />
              <span>Cancel Matchmaking</span>
            </button>
          ) : (
            <button
              onClick={handleStartSearch}
              className="neo-raised px-8 py-3 rounded-xl bg-primary-container text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-none"
            >
              <i className="ti ti-player-play" />
              <span>Find Competitive Match</span>
            </button>
          )}
        </div>
      </section>

      {/* Challenges & Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Active Challenges */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-raised flex items-center justify-center text-primary">
                <i className="ti ti-users text-sm" />
              </div>
              <h2 className="text-sm font-bold">Active Challenges</h2>
            </div>
            <span className="text-[11px] text-primary font-semibold hover:underline cursor-pointer">View All</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Friend Challenge Card 1 */}
            <div className="neo-raised p-3.5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-3">
                <Avatar name="Sarah Connor" imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAYjbppMwpuHCl0amlkZmvp1MWXpio_dohqDfrRYACDacIJbzSDpFGSJvk2Cfl15wI3QTSXWFITdiwV52naa1RqISb63B9UrBvbyVtSAPCC-qDVlOXQx2Ym2fTrQ2qLxKTlDR0rueBFpY_4RHvkK8dMhIIsYn1X3wWszBdFkPcDP_gev79a7DqNl97pMW6js7q05ogaDcMyixYCGCtDhR6VPtvdyvaIu75q3_7oNfj_Cc5rQ8CoFwzDG0c5F-5HPRnxdH0V7cTbHPk" size="sm" />
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Sarah Connor</h4>
                  <p className="text-[9px] text-on-surface-variant">Challenged you to 'Greek Roots'</p>
                </div>
              </div>
              <button className="neo-raised px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold active:scale-95 transition-all border-none cursor-pointer">
                Accept
              </button>
            </div>

            {/* Friend Challenge Card 2 */}
            <div className="neo-raised p-3.5 rounded-2xl flex items-center justify-between border border-white/5 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-3">
                <Avatar name="Marcus Aurelius" imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBKqxWGFXcxsJLdofbjK9TSA58CrxlQdhLIR4uWuM3_Y_8OsYjOnk3wH3CryTXuaFNc18SqRow5d5tGS6G74Dhn5wnc39FtJrsmqh0CTNlcXjymzMooyeGPRJ63n-8hi6LRXcd8HamqkosKGoHmxebOwx7RS7KmQa3bOi0sM3JYLqt6NtHPjdbW_BwZrXFR8woMrz1Jmzn0X5lAV77SGzgMvsNLEw8Jyx9zqNNQ5o0Uela-D8zx2blU1YZ2gbsFjB13o06QMfIsQl4" size="sm" />
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Marcus Aurelius</h4>
                  <p className="text-[9px] text-on-surface-variant">Waiting for your move...</p>
                </div>
              </div>
              <button className="neo-raised px-4 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant text-[10px] font-bold active:scale-95 transition-all border-none cursor-pointer">
                Resume
              </button>
            </div>
          </div>
        </div>

        {/* Global Battles Queue */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-raised flex items-center justify-center text-tertiary">
                <i className="ti ti-world text-sm" />
              </div>
              <h2 className="text-sm font-bold">Global Battles</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">1,240 Online</span>
            </div>
          </div>

          <div className="neo-inset p-2 rounded-2xl flex flex-col gap-1">
            {/* Queue Item 1 */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-outline/30 italic">01</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Hyper_Linguist</span>
                  <span className="text-[8px] text-on-surface-variant">Win Streak: 12</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-primary">Master</div>
                  <div className="text-[8px] text-outline">Rating: 2,450</div>
                </div>
                <i className="ti ti-bolt text-xs text-outline-variant" />
              </div>
            </div>

            {/* Queue Item 2 */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-outline/30 italic">02</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">WordSmith_99</span>
                  <span className="text-[8px] text-on-surface-variant">Win Streak: 3</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-tertiary">Diamond</div>
                  <div className="text-[8px] text-outline">Rating: 1,820</div>
                </div>
                <i className="ti ti-bolt text-xs text-outline-variant" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Select (Bento Style) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <i className="ti ti-swords text-primary" />
          <span>Choose Your Arena</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Blitz Mode */}
          <div className="neo-raised p-5 rounded-3xl group cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden h-40">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <i className="ti ti-clock text-9xl" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-extrabold text-white">Blitz Mode</h3>
                <p className="text-[10px] text-on-surface-variant mt-1.5 max-w-[160px]">
                  30 second rounds. Rapid fire vocabulary action.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-bold text-[10px]">
                <span>Play Now</span>
                <i className="ti ti-chevron-right text-xs" />
              </div>
            </div>
          </div>

          {/* Competitive Queue */}
          <div className="neo-inset p-5 rounded-3xl group cursor-pointer relative overflow-hidden h-40 border border-primary/20">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <i className="ti ti-trophy text-9xl" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="bg-primary/20 text-primary text-[8px] uppercase font-black px-2 py-0.5 rounded-full w-fit mb-1.5">
                  Ranked
                </div>
                <h3 className="text-sm font-extrabold text-white">Competitive Queue</h3>
                <p className="text-[10px] text-on-surface-variant mt-1.5 max-w-[160px]">
                  Standard matches. Gain or lose Rating Points.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-bold text-[10px]">
                {isSearching ? (
                  <>
                    <span>Searching...</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  </>
                ) : (
                  <>
                    <span>Queue Offline</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Practice VS AI */}
          <div className="neo-raised p-5 rounded-3xl group cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden h-40">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <i className="ti ti-cpu text-9xl" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm font-extrabold text-white">Practice VS AI</h3>
                <p className="text-[10px] text-on-surface-variant mt-1.5 max-w-[160px]">
                  Hone your skills against our semantic engine.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-bold text-[10px]">
                <span>Start Session</span>
                <i className="ti ti-chevron-right text-xs" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
