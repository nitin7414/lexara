"use client";

import { cn } from "@/lib/utils";

interface WordCardProps {
  word: string;
  meaning: string;
  example: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  goal?: "ACADEMIC" | "EXAM_PREP" | "PROFESSIONAL" | string | null;
  className?: string;
}

// Map of parts of speech for our seeded words
const PART_OF_SPEECH_MAP: Record<string, string> = {
  ephemeral: "adjective",
  cacophony: "noun",
  capricious: "adjective",
  loquacious: "adjective",
  taciturn: "adjective",
  lucid: "adjective",
  pragmatic: "adjective",
  venerate: "verb",
  superfluous: "adjective",
  mitigate: "verb",
  anomaly: "noun",
  equivocal: "adjective",
  lucrative: "adjective",
  assiduous: "adjective",
  fastidious: "adjective",
  vituperate: "verb",
  obsequious: "adjective",
  recalcitrant: "adjective",
  alacrity: "noun",
  magnanimous: "adjective",
  synergy: "noun",
  leverage: "verb",
  paradigm: "noun",
  deliverable: "noun",
  holistic: "adjective",
  agile: "adjective",
  divergent: "adjective",
  scalability: "noun",
  bottleneck: "noun",
  redundancy: "noun",
};

export function WordCard({
  word,
  meaning,
  example,
  difficulty,
  goal,
  className,
}: WordCardProps) {
  const partOfSpeech = PART_OF_SPEECH_MAP[word.toLowerCase()] || "vocabulary";
  
  let levelLabel = "General level";
  if (goal === "ACADEMIC") levelLabel = "NCERT level";
  else if (goal === "EXAM_PREP") levelLabel = "UPSC level";
  else if (goal === "PROFESSIONAL") levelLabel = "Corporate level";
  else {
    // Fallback based on difficulty if goal isn't passed
    levelLabel = difficulty === "HARD" ? "Advanced level" : difficulty === "MEDIUM" ? "Intermediate level" : "Beginner level";
  }

  // Highlight the word in the example sentence
  const renderHighlightedExample = (text: string, highlight: string) => {
    if (!text) return "";
    const regex = new RegExp(`\\b(${highlight})\\b`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-primary font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn("w-full space-y-4 font-sans select-none", className)}>
      {/* Large word card */}
      <div className="bg-primary-light border border-primary-light p-6 rounded-xl flex flex-col items-center text-center space-y-4">
        <div>
          <h2 className="text-3xl font-black text-primary-dark tracking-tight">
            {word}
          </h2>
          <p className="text-xs font-semibold text-primary/70 mt-1 uppercase tracking-wider">
            {partOfSpeech} · {levelLabel}
          </p>
        </div>

        {/* Meaning inner card (white, flat, rounded-xl) */}
        <div className="bg-white dark:bg-zinc-900 border border-primary-light w-full p-4 rounded-xl">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {meaning}
          </p>
        </div>
      </div>

      {/* Example sentence card */}
      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-1">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Example
        </span>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
          "{renderHighlightedExample(example, word)}"
        </p>
      </div>
    </div>
  );
}
