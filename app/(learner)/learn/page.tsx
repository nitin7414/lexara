"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StageIndicator } from "@/components/stage-indicator";
import { WordCard } from "@/components/word-card";
import { IconBox } from "@/components/icon-box";
import { cn } from "@/lib/utils";

interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

type Stage = "introduce" | "practice" | "test" | "complete";

const OPTION_LETTERS = ["A", "B", "C", "D"];

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

  const router = useRouter();

  // 1. Fetch Words
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

  // 2. Generate multiple choice options
  useEffect(() => {
    if (words.length === 0 || currentStage === "introduce" || currentStage === "complete") return;

    const currentWord = words[currentWordIndex];
    const otherWords = words.filter((w) => w.id !== currentWord.id).map((w) => w.word);

    const shuffledIncorrect = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    const finalOptions = [...shuffledIncorrect, currentWord.word].sort(() => 0.5 - Math.random());

    setOptions(finalOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [currentWordIndex, currentStage, words]);

  // 3. 15-second timer trigger via setTimeout (CSS handles smooth depletion)
  useEffect(() => {
    if (currentStage !== "test" || selectedAnswer !== null || words.length === 0) return;

    const timer = setTimeout(() => {
      handleTimeout();
    }, 15000);

    return () => clearTimeout(timer);
  }, [currentWordIndex, currentStage, selectedAnswer, words]);

  const handleTimeout = () => {
    setIsCorrect(false);
    setSelectedAnswer(""); // timeout mark

    const newTest = [...testResults];
    newTest[currentWordIndex] = false;
    setTestResults(newTest);

    setTimeout(() => {
      advanceStage();
    }, 1500);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    
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
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      if (currentStage === "introduce") {
        setCurrentStage("practice");
        setCurrentWordIndex(0);
      } else if (currentStage === "practice") {
        setCurrentStage("test");
        setCurrentWordIndex(0);
      } else if (currentStage === "test") {
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
        attempts: 2,
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
    const text = `I scored ${sessionScore}/5 on Lexara today!`;
    navigator.clipboard.writeText(text);
    alert("Score copied to clipboard!");
  };

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
    <div className="space-y-6 font-sans select-none text-[#CECBF6]">
      {/* CSS Styles for animations (Depleting timer bar and completion checkmark) */}
      <style>{`
        @keyframes timerDeplete {
          from { width: 100%; }
          to { width: 0%; }
        }
        .timer-bar-deplete {
          animation: timerDeplete 15s linear forwards;
        }
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

      {/* Redesigned Stage Indicator with Close Button */}
      <StageIndicator currentStage={currentStage} />

      {/* STAGE 1: INTRODUCE (Hero purple word card) */}
      {currentStage === "introduce" && (
        <div className="space-y-6">
          <WordCard
            word={currentWord.word}
            meaning={currentWord.meaning}
            example={currentWord.example}
            difficulty={currentWord.difficulty}
          />
          {/* CTA: radius 12px, padding 11px, size 13px, weight 500 */}
          <button
            onClick={advanceStage}
            className="w-full bg-[#7F77DD] hover:opacity-95 text-white py-[11px] rounded-xl text-[13px] font-medium tracking-wide uppercase transition-all cursor-pointer border-none"
          >
            Got it
          </button>
        </div>
      )}

      {/* STAGE 2: PRACTICE & STAGE 3: TEST (Dark Mode Session Styles) */}
      {(currentStage === "practice" || currentStage === "test") && (
        <div className="space-y-6">
          {/* Question Card Frame (bg: #241E40, border: 1px solid #3C3489) */}
          <div className="bg-[#241E40] border border-[#3C3489] p-6 rounded-xl relative overflow-hidden">
            {/* Urgency depleting CSS timer bar on test stage */}
            {currentStage === "test" && selectedAnswer === null && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#3C3489] w-full">
                <div
                  key={currentWordIndex}
                  className="h-full bg-[#EF9F27] timer-bar-deplete"
                />
              </div>
            )}

            <div className="space-y-4 pt-1.5">
              <span className="text-[10px] font-bold text-[#5F5E5A] uppercase tracking-widest leading-none block">
                Fill in the blank
              </span>
              <p className="text-[12px] font-medium text-[#CECBF6] italic leading-relaxed">
                "{renderSentenceWithBlank(currentWord.example, currentWord.word)}"
              </p>
            </div>
          </div>

          {/* Redesigned Answer options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isAnswerCorrect = option.toLowerCase() === currentWord.word.toLowerCase();
              const letter = OPTION_LETTERS[idx];
              
              let cardStyle = "bg-[#241E40] border-[#3C3489] text-[#AFA9EC] hover:bg-[#2D2550]/60";
              
              if (selectedAnswer !== null) {
                if (isSelected) {
                  cardStyle = isAnswerCorrect
                    ? "bg-[#E1F5EE] border-[#5DCAA5] text-[#085041]"
                    : "bg-[#FCEBEB] border-[#F09595] text-[#A32D2D]";
                } else if (isAnswerCorrect) {
                  cardStyle = "bg-[#E1F5EE] border-[#5DCAA5] text-[#085041] opacity-75";
                } else {
                  cardStyle = "bg-[#241E40] border-[#3C3489] text-[#AFA9EC] opacity-40";
                }
              }

              return (
                <button
                  key={option}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 flex items-center justify-between font-bold text-sm transition-all duration-200 select-none cursor-pointer",
                    cardStyle
                  )}
                >
                  <div className="flex items-center">
                    {/* Option letter badge: 20x20px, bg #2D2550, text #7F77DD */}
                    <span className="w-[20px] h-[20px] rounded bg-[#2D2550] text-[#7F77DD] text-[10px] font-bold flex items-center justify-center mr-3 shrink-0">
                      {letter}
                    </span>
                    <span className="text-[12px] font-medium">{option}</span>
                  </div>
                  {/* Append checkmark icon on the right for correct answer choice */}
                  {selectedAnswer !== null && isAnswerCorrect && isSelected && (
                    <i className="ti ti-check text-base leading-none ml-2 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback UI and Action buttons */}
          {selectedAnswer !== null && (
            <div className="space-y-4 pt-2">
              {selectedAnswer === "" ? (
                <div className="text-[#D85A30] font-bold text-[12px] text-center select-none flex items-center justify-center gap-1.5">
                  <i className="ti ti-alert-triangle" />
                  Time ran out!
                </div>
              ) : isCorrect ? (
                <div className="text-[#1D9E75] font-bold text-[12px] text-center select-none flex items-center justify-center gap-1.5">
                  <i className="ti ti-circle-check" />
                  Correct answer!
                </div>
              ) : (
                <div className="text-[#D85A30] font-bold text-[12px] text-center select-none flex items-center justify-center gap-1.5">
                  <i className="ti ti-alert-triangle" />
                  Incorrect choice. Correct: <span className="underline ml-1 font-bold">{currentWord.word}</span>
                </div>
              )}

              {/* Next Button — Success state gets bg: #1D9E75, else bg: #7F77DD */}
              {selectedAnswer !== "" && (
                <button
                  onClick={advanceStage}
                  className={cn(
                    "w-full text-white py-[11px] rounded-xl text-[13px] font-medium tracking-wide uppercase transition-all cursor-pointer border-none flex items-center justify-center gap-1.5",
                    isCorrect ? "bg-[#1D9E75]" : "bg-[#7F77DD]"
                  )}
                >
                  <span>{currentWordIndex < 4 ? "Next" : "Continue"}</span>
                  <i className="ti ti-arrow-right text-[13px]" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* STAGE 4: COMPLETE SCREEN */}
      {currentStage === "complete" && (
        <div className="min-h-[65vh] flex flex-col justify-center items-center text-center space-y-8 max-w-sm mx-auto">
          {/* Animated checkmark */}
          <div className="flex justify-center">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <div className="space-y-1.5 select-none">
            {/* Streak maintained gets an IconBox above or in top header. Flame iconbox centered */}
            {sessionScore >= 3 && (
              <div className="flex justify-center mb-3">
                <IconBox context="streak" size="md" />
              </div>
            )}
            <h1 className="text-[15px] font-medium text-[#CECBF6]">
              {sessionScore >= 3 ? "Streak maintained!" : "Session Completed!"}
            </h1>
            <p className="text-[11px] text-[#AFA9EC]">
              You reviewed all 5 words of today's learning loop.
            </p>
          </div>

          {/* Results grid (Secondary dark mode cards: bg #2D2550) */}
          <div className="grid grid-cols-2 gap-3 w-full bg-[#2D2550] p-4 rounded-xl">
            <div className="text-center border-r border-[#3C3489] py-2">
              <span className="text-[10px] font-bold text-[#AFA9EC] uppercase tracking-widest block">
                Score
              </span>
              <span className="text-base font-black text-[#CECBF6] mt-1 block">
                {sessionScore} / 5
              </span>
            </div>
            <div className="text-center py-2">
              <span className="text-[10px] font-bold text-[#AFA9EC] uppercase tracking-widest block">
                XP Earned
              </span>
              <span className="text-base font-black text-[#7F77DD] mt-1 block">
                +{sessionScore * 10} XP
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="w-full space-y-2">
            <button
              onClick={() => router.push("/battle")}
              className="w-full bg-[#7F77DD] hover:brightness-110 text-white py-[11px] rounded-xl text-[13px] font-semibold uppercase tracking-wider transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
            >
              <i className="ti ti-swords" />
              <span>Enter Word Battle</span>
            </button>
            <button
              onClick={handleShare}
              className="w-full bg-[#2D2550] hover:bg-[#2D2550]/80 text-[#CECBF6] py-[11px] rounded-xl text-[13px] font-medium uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Share score
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-[#2D2550] hover:bg-[#2D2550]/60 text-[#CECBF6] py-[11px] rounded-xl text-[13px] font-medium uppercase tracking-wider transition-all cursor-pointer border-none"
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
    <div className="space-y-6 animate-pulse select-none max-w-sm mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-zinc-800 rounded-full" />
        <div className="h-2 flex-1 bg-zinc-800 rounded-full" />
      </div>
      <div className="h-64 bg-zinc-800 rounded-xl" />
      <div className="h-10 bg-zinc-800 rounded-xl" />
    </div>
  );
}

function LearnError() {
  return (
    <div className="bg-[#241E40] border border-[#3C3489] p-8 rounded-xl text-center space-y-4 font-sans select-none text-[#CECBF6]">
      <div className="w-10 h-10 bg-red-950/20 text-[#D85A30] rounded-full flex items-center justify-center mx-auto">
        <i className="ti ti-alert-triangle text-lg" />
      </div>
      <div className="space-y-1">
        <h3 className="text-[12px] font-bold text-[#CECBF6]">
          Something went wrong.
        </h3>
        <p className="text-[10px] text-[#AFA9EC]">
          We couldn't load your learning session. Try again.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 bg-[#7F77DD] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider border-none"
      >
        Try again
      </button>
    </div>
  );
}

function LearnCompletedAlready() {
  const router = useRouter();
  return (
    <div className="bg-[#241E40] border border-[#3C3489] p-8 rounded-xl text-center space-y-6 font-sans select-none max-w-sm mx-auto text-[#CECBF6]">
      <div className="w-12 h-12 bg-emerald-950/20 text-[#1D9E75] rounded-full flex items-center justify-center mx-auto text-lg">
        <i className="ti ti-circle-check" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-[15px] font-medium text-[#CECBF6]">
          Daily words complete!
        </h3>
        <p className="text-[11px] text-[#AFA9EC] leading-relaxed">
          You've already reviewed all daily session words for today. Enter the PvP arena to continue practice!
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => router.push("/battle")}
          className="w-full py-[11px] bg-[#7F77DD] hover:brightness-110 text-white text-[13px] font-semibold rounded-xl uppercase tracking-wider border-none cursor-pointer flex items-center justify-center gap-1.5"
        >
          <i className="ti ti-swords" />
          <span>Word Battle Arena</span>
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-[11px] bg-[#2D2550] hover:bg-[#2D2550]/80 text-[#CECBF6] text-[13px] font-semibold rounded-xl uppercase tracking-wider border-none cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
