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
    levelLabel = difficulty === "HARD" ? "Advanced level" : difficulty === "MEDIUM" ? "Intermediate level" : "Beginner level";
  }

  // Trigger browser's SpeechSynthesis to read the word aloud (Audio button effect)
  const speakWord = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderHighlightedExample = (text: string, highlight: string) => {
    if (!text) return "";
    const regex = new RegExp(`\\b(${highlight})\\b`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="underline decoration-2 font-bold text-white">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={cn(
        "w-full bg-[#7F77DD] border border-[#7F77DD] p-6 rounded-xl flex flex-col items-center text-center space-y-5 select-none font-sans shadow-none",
        className
      )}
    >
      {/* Audio Icon Button (40x40px, rounded square, #ffffff22 bg) */}
      <button
        onClick={speakWord}
        className="w-[40px] h-[40px] rounded-lg bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer border-none outline-none focus:ring-2 focus:ring-white/30"
      >
        <i className="ti ti-volume text-white text-lg leading-none" />
      </button>

      {/* Word Header */}
      <div>
        <h2 className="text-[22px] font-medium text-white tracking-tight leading-none">
          {word}
        </h2>
        <p className="text-[10px] text-[#CECBF6] mt-1.5 font-medium uppercase tracking-wider">
          {partOfSpeech} · {levelLabel}
        </p>
      </div>

      {/* Meaning inner card (white translucent #ffffff22, 11px, white text) */}
      <div className="bg-white/10 border border-white/15 w-full p-4 rounded-xl text-left">
        <p className="text-[11px] font-medium text-white leading-relaxed">
          {meaning}
        </p>
      </div>

      {/* Example sentence translucent card */}
      <div className="bg-white/5 border border-white/10 w-full p-4 rounded-xl text-left space-y-1">
        <span className="text-[9px] font-bold text-[#CECBF6] uppercase tracking-widest leading-none">
          Example Usage
        </span>
        <p className="text-[11px] font-medium text-[#CECBF6] italic leading-relaxed">
          "{renderHighlightedExample(example, word)}"
        </p>
      </div>
    </div>
  );
}
