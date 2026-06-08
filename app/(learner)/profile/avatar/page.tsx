"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Persona {
  id: string;
  name: string;
  vibe: "male" | "female" | "kids" | "neutral";
  vibeText: string;
  stats: [number, number, number]; // [Knowledge, Creativity, Charisma]
  quote: string;
  imageUrl: string;
}

const PERSONAS: Persona[] = [
  {
    id: "avatar-cyberpunk",
    name: "The Cyberpunk",
    vibe: "female",
    vibeText: "Futuristic • Lvl 12",
    stats: [85, 95, 75],
    quote: "Futuristic digital specialist with neon visor and matte-black armor.",
    imageUrl: "/avatars/cyber_female_confident.png",
  },
  {
    id: "avatar-elven-scholar",
    name: "The Elven Scholar",
    vibe: "male",
    vibeText: "Mystical • Lvl 15",
    stats: [99, 75, 60],
    quote: "Wise, silver-haired elven master of ancient syntax and scripts.",
    imageUrl: "/avatars/fantasy_male_calm.png",
  },
  {
    id: "avatar-modern-learner",
    name: "The Modern Learner",
    vibe: "neutral",
    vibeText: "Focused • Lvl 5",
    stats: [90, 80, 85],
    quote: "Determined round-glass student embodying core focus and clarity.",
    imageUrl: "/avatars/edtech_neutral_focused.png",
  },
  {
    id: "avatar-astronaut",
    name: "The Astronaut",
    vibe: "male",
    vibeText: "Adventurous • Lvl 8",
    stats: [80, 70, 90],
    quote: "Optimistic voyager ready to explore the depths of language.",
    imageUrl: "/avatars/space_male_cheerful.png",
  },
  {
    id: "avatar-trendsetter",
    name: "The Trendsetter",
    vibe: "female",
    vibeText: "Cool • Lvl 10",
    stats: [70, 92, 95],
    quote: "Streetwear stylistic guru bringing cool, calculated gaze to study.",
    imageUrl: "/avatars/street_female_cool.png",
  },
  {
    id: "avatar-competitive-gamer",
    name: "The Competitive Gamer",
    vibe: "male",
    vibeText: "Fierce • Lvl 14",
    stats: [75, 88, 92],
    quote: "Electric orange streaks and high-tech gear for high-stakes battles.",
    imageUrl: "/avatars/arcade_male_fierce.png",
  },
  {
    id: "avatar-amara-vance",
    name: "Amara Vance",
    vibe: "female",
    vibeText: "Roots Specialist • Lvl 45",
    stats: [92, 85, 80],
    quote: "Elite competitive rival and master of etymology.",
    imageUrl: "/avatars/amara_vance.png",
  },
  {
    id: "avatar-sarah-connor",
    name: "Sarah Connor",
    vibe: "female",
    vibeText: "Tactical Scholar • Lvl 28",
    stats: [85, 90, 75],
    quote: "Sleek silver tactical suit and a confident, competitive smirk.",
    imageUrl: "/avatars/sarah_connor.png",
  },
  {
    id: "avatar-marcus-aurelius",
    name: "Marcus Aurelius",
    vibe: "male",
    vibeText: "Wise Emperor • Lvl 50",
    stats: [95, 70, 99],
    quote: "Stoic philosopher and master of vocabulary strategy.",
    imageUrl: "/avatars/marcus_aurelius.png",
  },
];


export default function AvatarSelectionPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // Selected state
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("avatar-0");

  // Mouse coordinates local to the wrapper for mouse glow
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    async function fetchCurrentAvatar() {
      try {
        const res = await fetch("/api/streak");
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            // Match saved URL against persona avatar URLs
            const match = PERSONAS.find((p) => p.imageUrl === data.imageUrl);
            if (match) {
              setSelectedPersonaId(match.id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load initial avatar config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentAvatar();
  }, []);

  const filteredPersonas = PERSONAS;

  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];
  const currentPreviewUrl = selectedPersona.imageUrl;

  const selectedIdRef = useRef(selectedPersonaId);
  useEffect(() => {
    selectedIdRef.current = selectedPersonaId;
  }, [selectedPersonaId]);

  // Scroll handler to track active scrolling item in the center
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    const cards = container.querySelectorAll(".persona-card");
    let closestId = selectedIdRef.current;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        const id = card.getAttribute("data-id");
        if (id) closestId = id;
      }
    });

    if (closestId !== selectedIdRef.current) {
      setSelectedPersonaId(closestId);
    }
  };

  // Scroll event listener
  useEffect(() => {
    if (loading || !containerRef.current) return;

    const container = containerRef.current;
    
    // Check initially
    handleScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loading, filteredPersonas]);

  // Initial scroll alignment
  useEffect(() => {
    if (!loading && !initialScrollDone && containerRef.current) {
      setTimeout(() => {
        const activeCard = containerRef.current?.querySelector(`[data-id="${selectedPersonaId}"]`);
        if (activeCard) {
          activeCard.scrollIntoView({ block: "center" });
        }
        setInitialScrollDone(true);
      }, 150);
    }
  }, [loading, selectedPersonaId, initialScrollDone]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - 128,
      y: e.clientY - rect.top - 128,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: currentPreviewUrl }),
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        alert("Failed to save avatar profile. Please try again.");
      }
    } catch (err) {
      console.error("Failed saving avatar:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-on-surface-variant font-medium text-sm">Loading personalization system...</p>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="flex flex-col lg:flex-row gap-8 min-h-[75vh] select-none text-[#e1e4ff] relative overflow-hidden p-1"
    >
      {/* Local HTML Styles for customized scale/blur transitions */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .rolling-container::-webkit-scrollbar {
              display: none;
            }
            .rolling-container {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .persona-card {
              scroll-snap-align: center;
              transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .persona-card.inactive {
              opacity: 0.35;
              transform: scale(0.85);
              filter: blur(1.5px);
            }
          `,
        }}
      />

      {/* Mouse Glow Effect */}
      <div
        className="pointer-events-none absolute w-64 h-64 bg-primary/5 rounded-full blur-[120px] z-0 transition-all duration-75 ease-out"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* Left Area: Rolling Persona Selector */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 relative z-10">
        <div className="w-full max-w-xl text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tighter mb-2">
            The Rolling Choice
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Scroll to find your perfect match. Your persona defines your journey.
          </p>
        </div>

        {/* Scroll Container */}
        <div
          ref={containerRef}
          className="rolling-container w-full max-w-md h-[40vh] md:h-[48vh] overflow-y-scroll flex flex-col items-center py-[16vh] gap-16 relative"
          style={{
            scrollSnapType: "y mandatory",
          }}
        >
          {filteredPersonas.map((persona) => {
            const isSelected = selectedPersonaId === persona.id;
            return (
              <div
                key={persona.id}
                data-id={persona.id}
                onClick={() => {
                  const card = containerRef.current?.querySelector(`[data-id="${persona.id}"]`);
                  if (card) {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className={cn(
                  "persona-card flex-shrink-0 w-60 md:w-68 flex flex-col items-center cursor-pointer",
                  !isSelected && "inactive"
                )}
              >
                <div className="w-full aspect-square rounded-[2.5rem] neomorphic-raised p-3 bg-surface-container relative group overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden rounded-[1.8rem]">
                    <img
                      alt={persona.name}
                      src={persona.imageUrl}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500",
                        !isSelected && "grayscale opacity-60 scale-95"
                      )}
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500",
                      isSelected ? "opacity-100" : "opacity-0"
                    )} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      Focus Avatar
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-black text-primary tracking-tight">
                    {persona.name}
                  </h2>
                  <p className="text-on-surface-variant text-[11px] font-semibold mt-1">
                    {persona.vibeText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile-only Stats Summary */}
        <div className="lg:hidden w-full max-w-xs mt-4 flex items-center justify-between text-center gap-2 bg-surface-container-low/40 border border-white/5 p-3.5 rounded-2xl backdrop-blur-md">
          <div className="flex-1">
            <span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Knowledge</span>
            <span className="text-sm font-black text-primary">{selectedPersona.stats[0]}%</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/10" />
          <div className="flex-1">
            <span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Creativity</span>
            <span className="text-sm font-black text-tertiary">{selectedPersona.stats[1]}%</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/10" />
          <div className="flex-1">
            <span className="block text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">Charisma</span>
            <span className="text-sm font-black text-secondary">{selectedPersona.stats[2]}%</span>
          </div>
        </div>

        {/* Mobile Quote Banner */}
        <p className="lg:hidden text-center text-[10px] text-on-surface-variant italic max-w-xs mt-3 px-2">
          "{selectedPersona.quote}"
        </p>

        {/* Action Button & Cancel Option */}
        <div className="mt-6 w-full max-w-xs flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 px-6 bg-primary text-on-primary font-bold text-xs rounded-2xl shadow-[0_10px_25px_-10px_rgba(112,115,255,0.5)] hover:brightness-110 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border-none disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Persona...</span>
            ) : (
              <>
                <span>Save Persona: {selectedPersona.name}</span>
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </>
            )}
          </button>

          <Link
            href="/profile"
            className="w-full py-3 text-center rounded-2xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-bold text-xs transition-all active:scale-95 border border-white/5 cursor-pointer"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Right Side: Persona Stats Panel (Desktop-only) */}
      <aside className="hidden lg:flex w-[320px] bg-surface-container-low border border-white/5 p-8 flex-col gap-8 relative z-10 rounded-[2rem] neomorphic-card">
        <section>
          <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl">analytics</span>
            Persona Stats
          </h2>
          <div className="space-y-6">
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Knowledge</span>
                <span className="text-primary font-black">{selectedPersona.stats[0]}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${selectedPersona.stats[0]}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Creativity</span>
                <span className="text-tertiary font-black">{selectedPersona.stats[1]}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary transition-all duration-500 ease-out"
                  style={{ width: `${selectedPersona.stats[1]}%` }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Charisma</span>
                <span className="text-secondary font-black">{selectedPersona.stats[2]}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-500 ease-out"
                  style={{ width: `${selectedPersona.stats[2]}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-auto p-4 rounded-2xl bg-surface shadow-inner border border-primary/10">
          <p className="text-xs text-center text-on-surface-variant italic leading-relaxed">
            "{selectedPersona.quote}"
          </p>
        </div>
      </aside>
    </div>
  );
}