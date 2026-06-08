"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/utils";

interface Question {
  word: string;
  partOfSpeech: string;
  options: string[];
  correctAnswer: string;
}

const SAMPLE_BATTLE_QUESTIONS: Question[] = [
  {
    word: "Inexorable",
    partOfSpeech: "Adjective",
    options: [
      "Impossible to stop or prevent.",
      "Easily persuaded or moved by entreaty.",
      "Showing or having a great deal of variety.",
      "Lacking flavor; weak or tasteless."
    ],
    correctAnswer: "Impossible to stop or prevent."
  },
  {
    word: "Mercurial",
    partOfSpeech: "Adjective",
    options: [
      "Extremely slow and passive in nature.",
      "Subject to sudden or unpredictable changes of mood.",
      "Highly resistant to chemical reactions.",
      "Relating to the planet Mars."
    ],
    correctAnswer: "Subject to sudden or unpredictable changes of mood."
  },
  {
    word: "Epitome",
    partOfSpeech: "Noun",
    options: [
      "A long, winding narrative story.",
      "A person or thing that is a perfect example of a quality.",
      "An increase in weight or body mass.",
      "A decorative border on a classical building."
    ],
    correctAnswer: "A person or thing that is a perfect example of a quality."
  },
  {
    word: "Pernicious",
    partOfSpeech: "Adjective",
    options: [
      "Having a harmful effect, especially in a gradual way.",
      "Intended to teach, particularly in having moral instruction.",
      "Extremely beneficial to physical health.",
      "Quick to recover from injuries."
    ],
    correctAnswer: "Having a harmful effect, especially in a gradual way."
  },
  {
    word: "Lethargy",
    partOfSpeech: "Noun",
    options: [
      "A state of high energy and excitement.",
      "A lack of energy and enthusiasm.",
      "A legal document outlining property rights.",
      "A type of classical poetry."
    ],
    correctAnswer: "A lack of energy and enthusiasm."
  }
];

export default function WordBattleLivePage() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(0);
  const [playerScore, setPlayerScore] = useState(1450);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [opponentScore, setOpponentScore] = useState(1220);
  const [opponentStreak, setOpponentStreak] = useState(3);
  const [timeLeft, setTimeLeft] = useState(100); // percentage 100 to 0
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<"correct" | "wrong" | null>(null);
  const [battleOver, setBattleOver] = useState(false);

  // Powerups states
  const [doubleXpActive, setDoubleXpActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);

  const currentQuestion = SAMPLE_BATTLE_QUESTIONS[currentRound];

  // Simulated Opponent real-time scoring increments
  useEffect(() => {
    if (battleOver) return;
    const oppInterval = setInterval(() => {
      // 30% chance every 2.5s for opponent to get points
      if (Math.random() > 0.7) {
        setOpponentScore((prev) => prev + 120);
        setOpponentStreak((prev) => prev + 1);
      }
    }, 2500);
    return () => clearInterval(oppInterval);
  }, [battleOver]);

  // Depleting round timer
  useEffect(() => {
    if (battleOver || selectedOption !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 100); // 10 seconds total round (100 * 100ms)

    return () => clearInterval(timer);
  }, [currentRound, selectedOption, battleOver]);

  const handleTimeout = () => {
    setFeedbackState("wrong");
    setSelectedOption(""); // Timed out indicator
    setPlayerStreak(0);
    setTimeout(() => {
      advanceRound();
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null || battleOver) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;

    if (correct) {
      setFeedbackState("correct");
      let addedPoints = 150;
      if (doubleXpActive) {
        addedPoints *= 2;
        setDoubleXpActive(false);
      }
      setPlayerScore((prev) => prev + addedPoints);
      setPlayerStreak((prev) => prev + 1);
    } else {
      setFeedbackState("wrong");
      if (shieldActive) {
        setShieldActive(false); // protect streak
      } else {
        setPlayerStreak(0);
      }
    }

    // Auto advance after brief delay
    setTimeout(() => {
      advanceRound();
    }, 1500);
  };

  const advanceRound = () => {
    setSelectedOption(null);
    setFeedbackState(null);
    setTimeLeft(100);

    if (currentRound < SAMPLE_BATTLE_QUESTIONS.length - 1) {
      setCurrentRound((prev) => prev + 1);
    } else {
      setBattleOver(true);
    }
  };

  const activateDoubleXp = () => {
    if (selectedOption !== null || doubleXpActive) return;
    setDoubleXpActive(true);
  };

  const activateShield = () => {
    if (selectedOption !== null || shieldActive) return;
    setShieldActive(true);
  };

  const triggerPostXp = async () => {
    try {
      // Simulate streak update or rewards on complete
      await fetch("/api/streak/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: [{ wordId: "battle-session", correct: playerScore > opponentScore }]
        })
      });
    } catch (e) {
      console.error(e);
    }
    router.push("/battle");
  };

  // 1. GAME OVER RENDER
  if (battleOver) {
    const playerWon = playerScore >= opponentScore;
    return (
      <div className="min-h-[75vh] flex flex-col justify-center items-center text-center space-y-8 max-w-md mx-auto text-[#e1e4ff] select-none font-sans p-4">
        {/* Animated Trophy / Crown Header */}
        <div className="flex flex-col items-center space-y-2">
          {playerWon ? (
            <>
              <div className="w-20 h-20 rounded-full bg-tertiary/20 flex items-center justify-center border-2 border-tertiary shadow-[0_0_30px_rgba(249,189,34,0.3)] animate-pulse">
                <i className="ti ti-trophy text-4xl text-tertiary" />
              </div>
              <h1 className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mt-4">
                VICTORY!
              </h1>
              <p className="text-xs text-on-surface-variant">
                You outperformed Amara Vance in vocabulary precision!
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-error/20 flex items-center justify-center border-2 border-error shadow-[0_0_30px_rgba(249,115,134,0.3)]">
                <i className="ti ti-crown-off text-4xl text-error" />
              </div>
              <h1 className="text-2xl font-black text-white mt-4">DEFEAT</h1>
              <p className="text-xs text-on-surface-variant">
                Amara Vance secured the victory. Practice makes perfect!
              </p>
            </>
          )}
        </div>

        {/* Scoring Bento Card */}
        <div className="grid grid-cols-2 gap-4 w-full bg-[#14192a] p-5 rounded-2xl border border-outline-variant/20 shadow-xl">
          <div className="text-center border-r border-outline-variant/10 py-2">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">
              Your Score
            </span>
            <span className="text-lg font-black text-primary mt-1 block">
              {playerScore} PTS
            </span>
          </div>
          <div className="text-center py-2">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">
              Rewards
            </span>
            <span className="text-lg font-black text-tertiary mt-1 block">
              {playerWon ? "+50 XP" : "+10 XP"}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full space-y-3">
          <button
            onClick={triggerPostXp}
            className="w-full bg-primary hover:brightness-110 text-white py-[12px] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <i className="ti ti-check" />
            <span>Claim Rewards & Exit</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. ACTIVE GAMEPLAY RENDER
  return (
    <div className="space-y-6 text-[#e1e4ff] select-none font-sans pb-16">
      {/* Depleting Timer Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-surface-container-lowest overflow-hidden z-50 md:pl-64">
        <div
          className={cn(
            "h-full transition-all duration-100 ease-linear",
            timeLeft < 20 ? "bg-error animate-pulse" : "timer-gradient"
          )}
          style={{ width: `${timeLeft}%` }}
        />
      </div>

      {/* Scoreboard / Progress Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#0f1322]/40 p-4 rounded-2xl border border-outline-variant/15 backdrop-blur-sm">
        {/* User Stats */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full neomorph-raised p-0.5 border border-outline-variant/20">
              <Avatar name="Alex Mercer" size="md" className="w-full h-full rounded-full border-none" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-tertiary-container text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
              YOU
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-end mb-0.5">
              <span className="text-xs font-black text-on-surface">{playerScore} PTS</span>
              {playerStreak > 0 && (
                <span className="text-[8px] font-bold text-tertiary uppercase tracking-widest flex items-center gap-0.5">
                  <i className="ti ti-flame text-xs" /> Streak x{playerStreak}
                </span>
              )}
            </div>
            <div className="w-full h-2.5 neomorph-inset rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (playerScore / 2500) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Opponent Stats */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="relative">
            <div className="w-14 h-14 rounded-full neomorph-raised p-0.5 border border-outline-variant/20">
              <img
                src="/avatars/amara_vance.png"
                alt="Amara Vance"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -left-1 bg-error/20 text-error text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-error/30">
              OPP
            </div>
          </div>
          <div className="flex-grow text-right">
            <div className="flex justify-between items-end mb-0.5 flex-row-reverse">
              <span className="text-xs font-black text-on-surface">{opponentScore} PTS</span>
              {opponentStreak > 0 && (
                <span className="text-[8px] font-bold text-error uppercase tracking-widest flex items-center gap-0.5">
                  <i className="ti ti-flame text-xs" /> Streak x{opponentStreak}
                </span>
              )}
            </div>
            <div className="w-full h-2.5 neomorph-inset rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-error-dim rounded-full transition-all duration-300 ml-auto"
                style={{ width: `${Math.min(100, (opponentScore / 2500) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Word Display */}
      <section className="flex flex-col items-center justify-center py-6">
        <div className="neomorph-inset p-8 md:p-10 rounded-[2rem] w-full text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest block mb-1">
            Round {currentRound + 1} / 5
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 relative z-10">
            {currentQuestion.word}
          </h1>
          <p className="text-outline text-[11px] font-medium uppercase tracking-[0.2em] relative z-10">
            Part of Speech: {currentQuestion.partOfSpeech}
          </p>

          {/* Speed bonus indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-tertiary">
            <i className="ti ti-bolt text-sm animate-bounce" />
            <span className="text-[9px] font-bold">SPEED BONUS ACTIVE</span>
          </div>
        </div>
      </section>

      {/* Definition Options (Multiple Choice) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          const isSelected = selectedOption === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;

          let optionStyle = "neomorph-raised border-transparent hover:border-outline/20";
          if (selectedOption !== null) {
            if (isSelected) {
              optionStyle = isCorrectAnswer
                ? "bg-[#14b8a6]/10 border-[#14b8a6] text-[#14b8a6] glow-card"
                : "bg-error/10 border-error text-error";
            } else if (isCorrectAnswer) {
              optionStyle = "bg-[#14b8a6]/10 border-[#14b8a6]/60 text-[#14b8a6] opacity-80";
            } else {
              optionStyle = "neomorph-raised opacity-40";
            }
          }

          return (
            <button
              key={option}
              disabled={selectedOption !== null}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                "p-5 rounded-2xl text-left neomorph-button group relative overflow-hidden border transition-all duration-200 cursor-pointer text-on-surface",
                optionStyle
              )}
            >
              <span className="block text-[10px] font-bold text-outline-variant mb-1 group-hover:text-primary transition-colors">
                OPTION {letter}
              </span>
              <p className="text-xs font-semibold leading-relaxed">{option}</p>
            </button>
          );
        })}
      </section>

      {/* Battle Action FABs (Double XP and Shield) */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3.5 z-40 select-none">
        {/* Double XP Button */}
        <div className="group relative">
          <div
            className={cn(
              "absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1f32] border border-outline-variant/30 rounded-lg text-[9px] font-bold text-tertiary transition-opacity whitespace-nowrap",
              doubleXpActive ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100"
            )}
          >
            DOUBLE SCORE {doubleXpActive ? "ACTIVE" : ""}
          </div>
          <button
            onClick={activateDoubleXp}
            disabled={selectedOption !== null || doubleXpActive}
            className={cn(
              "w-12 h-12 rounded-full neomorph-raised flex items-center justify-center neomorph-button border border-tertiary/30 cursor-pointer",
              doubleXpActive ? "text-white bg-tertiary animate-pulse" : "text-tertiary"
            )}
          >
            <i className="ti ti-bolt text-lg" />
          </button>
        </div>

        {/* Shield Button */}
        <div className="group relative">
          <div
            className={cn(
              "absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1f32] border border-outline-variant/30 rounded-lg text-[9px] font-bold text-primary transition-opacity whitespace-nowrap",
              shieldActive ? "opacity-100" : "opacity-0 pointer-events-none group-hover:opacity-100"
            )}
          >
            SHIELD STREAK {shieldActive ? "ACTIVE" : ""}
          </div>
          <button
            onClick={activateShield}
            disabled={selectedOption !== null || shieldActive}
            className={cn(
              "w-12 h-12 rounded-full neomorph-raised flex items-center justify-center neomorph-button border border-primary/30 cursor-pointer",
              shieldActive ? "text-white bg-primary animate-pulse" : "text-primary"
            )}
          >
            <i className="ti ti-shield text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
