"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StageIndicator } from "@/components/stage-indicator";
import { WordCard } from "@/components/word-card";
import { cn } from "@/lib/utils";

interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

type Stage = "introduce" | "practice" | "test" | "complete";

export default function LearnPage() {
  const [currentStage, setCurrentStage] = useState<Stage>("introduce");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Practice & Test state
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Results tracking
  const [practiceResults, setPracticeResults] = useState<boolean[]>([]);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [savingResults, setSavingResults] = useState(false);

  // Timer state for Test stage
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  const router = useRouter();

  // 1. Fetch Words on mount
  useEffect(() => {
    async function fetchWords() {
      try {
        setLoading(true);
        const res = await fetch("/api/words");
        if (!res.ok) throw new Error("Failed to load words");
        const data = await res.json();

        if (data.alreadyCompleted) {
          setAlreadyCompleted(true);
        } else {
          setWords(data.words);
        }
      } catch (err) {
        console.error("Learn page fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWords();
  }, []);

  // 2. Generate multiple choice options for Practice & Test stages
  useEffect(() => {
    if (words.length === 0 || currentStage === "introduce" || currentStage === "complete") return;

    const currentWord = words[currentWordIndex];
    const otherWords = words.filter((w) => w.id !== currentWord.id).map((w) => w.word);

    // Shuffle and pick 3 incorrect options
    const shuffledIncorrect = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    // Shuffle correct option in
    const finalOptions = [...shuffledIncorrect, currentWord.word].sort(() => 0.5 - Math.random());

    setOptions(finalOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Setup timer if Stage 3 (Test)
    if (currentStage === "test") {
      setTimeLeft(15);
      setTimerActive(true);
    }
  }, [currentWordIndex, currentStage, words]);

  // 3. Countdown timer implementation for Test stage
  useEffect(() => {
    if (currentStage !== "test" || !timerActive || words.length === 0) return;

    const startTime = Date.now();
    const duration = 15000; // 15 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 15 - elapsed / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setTimerActive(false);
        handleTimeout();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentWordIndex, currentStage, timerActive, words]);

  // Handlers
  const handleTimeout = () => {
    setIsCorrect(false);
    setSelectedAnswer(""); // empty string represents timeout

    const newTest = [...testResults];
    newTest[currentWordIndex] = false;
    setTestResults(newTest);

    // Wait 1.5s to show time out, then advance
    setTimeout(() => {
      advanceStage();
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent double answering
    
    // Stop timer
    setTimerActive(false);

    const currentWord = words[currentWordIndex];
    const correct = option.toLowerCase() === currentWord.word.toLowerCase();

    setSelectedAnswer(option);
    setIsCorrect(correct);

    if (currentStage === "practice") {
      const newPractice = [...practiceResults];
      newPractice[currentWordIndex] = correct;
      setPracticeResults(newPractice);
    } else if (currentStage === "test") {
      const newTest = [...testResults];
      newTest[currentWordIndex] = correct;
      setTestResults(newTest);
      if (correct) {
        setSessionScore((prev) => prev + 1);
      }
    }
  };

  const advanceStage = async () => {
    if (currentWordIndex < 4) {
      // Move to next word in current stage
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      // Transition to next stage
      if (currentStage === "introduce") {
        setCurrentStage("practice");
        setCurrentWordIndex(0);
      } else if (currentStage === "practice") {
        setCurrentStage("test");
        setCurrentWordIndex(0);
      } else if (currentStage === "test") {
        // Log final session progress
        await submitSession();
        setCurrentStage("complete");
      }
    }
  };

  const submitSession = async () => {
    setSavingResults(true);
    try {
      const finalResults = words.map((w, idx) => ({
        wordId: w.id,
        correct: testResults[idx] ?? false,
        attempts: 2, // 1 in practice + 1 in test
      }));

      await fetch("/api/streak/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: finalResults }),
      });
    } catch (error) {
      console.error("Error submitting session results:", error);
    } finally {
      setSavingResults(false);
    }
  };

  const handleShare = () => {
    const text = `I scored ${sessionScore}/5 on Lexara today! 🔥 #vocabulary`;
    navigator.clipboard.writeText(text);
    alert("Score copied to clipboard!");
  };

  // Rendering Helpers
  const renderSentenceWithBlank = (sentence: string, targetWord: string) => {
    const regex = new RegExp(`\\b${targetWord}\\b`, "gi");
    return sentence.replace(regex, "_______");
  };

  if (loading) {
    return <LearnSkeleton />;
  }

  if (error) {
    return <LearnError />;
  }

  if (alreadyCompleted) {
    return <LearnCompletedAlready />;
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Styles for animated checkmark */}
      <style>{`
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #1D9E75;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #1D9E75;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s forwards;
        }
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
        @keyframes fill {
          100% { box-shadow: inset 0px 0px 0px 30px #1D9E75; }
        }
      `}</style>

      {/* Stage Tracker bar */}
      <StageIndicator
        currentStage={currentStage}
        currentWordIndex={currentWordIndex}
        totalWords={words.length}
      />

      {/* STAGE 1: INTRODUCE */}
      {currentStage === "introduce" && (
        <div className="space-y-6">
          <WordCard
            word={currentWord.word}
            meaning={currentWord.meaning}
            example={currentWord.example}
            difficulty={currentWord.difficulty}
          />
          <button
            onClick={advanceStage}
            className="w-full bg-primary hover:opacity-95 text-white py-4.5 rounded-lg text-sm font-extrabold tracking-wide uppercase transition-all cursor-pointer"
          >
            Got it →
          </button>
        </div>
      )}

      {/* STAGE 2: PRACTICE & STAGE 3: TEST */}
      {(currentStage === "practice" || currentStage === "test") && (
        <div className="space-y-6 relative">
          {/* Timer bar for Test stage */}
          {currentStage === "test" && selectedAnswer === null && (
            <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${(timeLeft / 15) * 100}%` }}
                className={cn(
                  "h-full transition-all duration-100 ease-linear",
                  timeLeft > 5 ? "bg-warning" : "bg-red-500"
                )}
              />
            </div>
          )}

          {/* Question Sentence Block */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Fill in the blank
            </span>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 italic leading-relaxed">
              "{renderSentenceWithBlank(currentWord.example, currentWord.word)}"
            </p>
          </div>

          {/* Options grid (2x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isAnswerCorrect = option.toLowerCase() === currentWord.word.toLowerCase();
              
              let cardStyle = "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60";
              
              if (selectedAnswer !== null) {
                if (isSelected) {
                  cardStyle = isAnswerCorrect
                    ? "bg-success-light border-success text-success"
                    : "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-600";
                } else if (isAnswerCorrect) {
                  // highlight correct answer if they got it wrong
                  cardStyle = "bg-success-light border-success text-success opacity-80";
                } else {
                  cardStyle = "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-50";
                }
              }

              return (
                <button
                  key={option}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 font-bold text-sm transition-all duration-200 select-none cursor-pointer",
                    cardStyle
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback bar */}
          {selectedAnswer !== null && (
            <div className="space-y-4 pt-2">
              {selectedAnswer === "" ? (
                <div className="text-red-500 font-extrabold text-sm text-center select-none flex items-center justify-center gap-1.5 animate-bounce">
                  ⚠️ Time ran out!
                </div>
              ) : isCorrect ? (
                <div className="text-success font-extrabold text-sm text-center select-none flex items-center justify-center gap-1.5">
                  ✓ Correct! Well done.
                </div>
              ) : (
                <div className="text-red-500 font-extrabold text-sm text-center select-none flex items-center justify-center gap-1.5">
                  ✗ Incorrect. Correct word is: <span className="underline">{currentWord.word}</span>
                </div>
              )}

              {/* Next Button (only visible for non-timeouts, timeouts auto-advance after showing answer) */}
              {selectedAnswer !== "" && (
                <button
                  onClick={advanceStage}
                  className="w-full bg-primary hover:opacity-95 text-white py-4 rounded-lg text-sm font-extrabold tracking-wide uppercase transition-all cursor-pointer"
                >
                  {currentWordIndex < 4 ? "Next →" : "Continue"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: COMPLETE SCREEN */}
      {currentStage === "complete" && (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center space-y-8 max-w-sm mx-auto">
          {/* Animated checkmark */}
          <div className="flex justify-center">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2 select-none">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {sessionScore >= 3 ? "Streak maintained! 🔥" : "Session Completed!"}
            </h1>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              You reviewed all 5 words of today's learning loop.
            </p>
          </div>

          {/* Score Stats widget */}
          <div className="grid grid-cols-2 gap-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
            <div className="text-center border-r border-zinc-100 dark:border-zinc-800 py-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Score
              </span>
              <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-1 block">
                {sessionScore} / 5
              </span>
            </div>
            <div className="text-center py-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                XP Earned
              </span>
              <span className="text-xl font-black text-primary mt-1 block">
                +{sessionScore * 10} XP
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={handleShare}
              className="w-full bg-primary-light text-primary hover:bg-primary-light/85 py-4 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer"
            >
              Share score
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-zinc-900 dark:bg-zinc-100 hover:opacity-95 text-white dark:text-zinc-900 py-4 rounded-lg text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LearnSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>
        <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

function LearnError() {
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
          We couldn't load your learning session. Try again.
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

function LearnCompletedAlready() {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl text-center space-y-6 font-sans select-none max-w-sm mx-auto">
      <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto text-2xl font-black">
        ✓
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
          Daily words complete!
        </h3>
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          You've already reviewed all daily session words for today. Come back tomorrow!
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="w-full py-4 bg-primary text-white text-sm font-extrabold rounded-lg uppercase tracking-wider"
      >
        Back to home
      </button>
    </div>
  );
}
