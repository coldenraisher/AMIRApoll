import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

interface PollOption {
  id: string;
  label: string;
  votes: number;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  barColor: string;
  iconEmoji: string;
}

const DEFAULT_QUESTION = "What's your favorite frontend framework?";

const DEFAULT_OPTIONS: PollOption[] = [
  {
    id: "a",
    label: "React",
    votes: 0,
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    hoverColor: "hover:bg-sky-100 hover:border-sky-300",
    barColor: "from-sky-400 to-sky-600",
    iconEmoji: "⚛️",
  },
  {
    id: "b",
    label: "Vue",
    votes: 0,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverColor: "hover:bg-emerald-100 hover:border-emerald-300",
    barColor: "from-emerald-400 to-emerald-600",
    iconEmoji: "💚",
  },
  {
    id: "c",
    label: "Angular",
    votes: 0,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    hoverColor: "hover:bg-red-100 hover:border-red-300",
    barColor: "from-red-400 to-red-600",
    iconEmoji: "🅰️",
  },
  {
    id: "d",
    label: "Svelte",
    votes: 0,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:bg-orange-100 hover:border-orange-300",
    barColor: "from-orange-400 to-orange-600",
    iconEmoji: "🔥",
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    if (prev === value) return;

    const start = prev;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display}</>;
}

function VoteButton({
  option,
  onVote,
  hasVoted,
  votedFor,
}: {
  option: PollOption;
  onVote: (id: string) => void;
  hasVoted: boolean;
  votedFor: string | null;
}) {
  const isSelected = votedFor === option.id;

  return (
    <button
      onClick={() => onVote(option.id)}
      disabled={hasVoted}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left transition-all duration-300",
        hasVoted && !isSelected && "opacity-50 cursor-not-allowed",
        hasVoted && isSelected &&
          `${option.bgColor} ${option.borderColor} ring-2 ring-offset-2 ${option.borderColor.replace("border", "ring")} cursor-default`,
        !hasVoted &&
          `${option.bgColor} ${option.borderColor} ${option.hoverColor} cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
      )}
    >
      <span className="text-2xl">{option.iconEmoji}</span>
      <span className={cn("text-lg font-semibold", option.color)}>
        {option.label}
      </span>
      {isSelected && (
        <span className="ml-auto flex items-center gap-1.5 text-sm font-medium text-green-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Voted
        </span>
      )}
    </button>
  );
}

function ResultBar({
  option,
  totalVotes,
  maxVotes,
}: {
  option: PollOption;
  totalVotes: number;
  maxVotes: number;
}) {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const widthPercentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
  const isLeading = option.votes === maxVotes && maxVotes > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{option.iconEmoji}</span>
          <span className={cn("text-sm font-semibold", option.color)}>
            {option.label}
          </span>
          {isLeading && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
              👑 Leading
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-700 tabular-nums">
            <AnimatedNumber value={Math.round(percentage)} />%
          </span>
          <span className="text-xs text-slate-400 tabular-nums">
            (<AnimatedNumber value={option.votes} /> vote{option.votes !== 1 ? "s" : ""})
          </span>
        </div>
      </div>
      <div className="relative h-10 w-full overflow-hidden rounded-xl bg-slate-100">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r transition-all duration-700 ease-out",
            option.barColor,
            isLeading && "shadow-lg"
          )}
          style={{ width: `${Math.max(widthPercentage, option.votes > 0 ? 3 : 0)}%` }}
        />
        {option.votes > 0 && (
          <div
            className="absolute inset-y-0 left-0 flex items-center transition-all duration-700 ease-out"
            style={{ width: `${Math.max(widthPercentage, 3)}%` }}
          >
            <span className="ml-auto mr-3 text-xs font-bold text-white drop-shadow-sm">
              <AnimatedNumber value={option.votes} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            fontSize: `${12 + Math.random() * 16}px`,
            opacity: 0.8,
          }}
        >
          {["🎉", "✨", "🎊", "⭐", "🌟"][Math.floor(Math.random() * 5)]}
        </div>
      ))}
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative ml-2 flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
    </span>
  );
}

export function App() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [options, setOptions] = useState<PollOption[]>(DEFAULT_OPTIONS);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editQuestion, setEditQuestion] = useState(question);
  const [simulateActive, setSimulateActive] = useState(false);
  const simulateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...options.map((o) => o.votes));

  const handleVote = useCallback(
    (id: string) => {
      if (hasVoted) return;
      setOptions((prev) =>
        prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o))
      );
      setHasVoted(true);
      setVotedFor(id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    },
    [hasVoted]
  );

  const handleReset = useCallback(() => {
    setOptions((prev) => prev.map((o) => ({ ...o, votes: 0 })));
    setHasVoted(false);
    setVotedFor(null);
    if (simulateRef.current) {
      clearInterval(simulateRef.current);
      simulateRef.current = null;
    }
    setSimulateActive(false);
  }, []);

  const handleSaveQuestion = () => {
    setQuestion(editQuestion);
    setIsEditingQuestion(false);
  };

  const toggleSimulate = useCallback(() => {
    if (simulateActive) {
      if (simulateRef.current) {
        clearInterval(simulateRef.current);
        simulateRef.current = null;
      }
      setSimulateActive(false);
    } else {
      setSimulateActive(true);
      simulateRef.current = setInterval(() => {
        setOptions((prev) => {
          const weights = [0.4, 0.25, 0.2, 0.15];
          const rand = Math.random();
          let cumulative = 0;
          let chosenIdx = 0;
          for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (rand < cumulative) {
              chosenIdx = i;
              break;
            }
          }
          return prev.map((o, i) =>
            i === chosenIdx ? { ...o, votes: o.votes + 1 } : o
          );
        });
      }, 300);
    }
  }, [simulateActive]);

  useEffect(() => {
    return () => {
      if (simulateRef.current) clearInterval(simulateRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40">
      <Confetti show={showConfetti} />

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Live Poll</h1>
              <p className="text-xs text-slate-400">Real-time audience voting</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="hidden sm:inline">LIVE</span>
            <LiveDot />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Question + Voting */}
          <div className="space-y-6">
            {/* Question Card */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Question
              </div>

              {isEditingQuestion ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50/50 px-4 py-3 text-lg font-semibold text-slate-800 outline-none focus:border-indigo-400"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveQuestion()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveQuestion}
                      className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingQuestion(false);
                        setEditQuestion(question);
                      }}
                      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group flex items-start gap-2">
                  <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    {question}
                  </h2>
                  <button
                    onClick={() => {
                      setEditQuestion(question);
                      setIsEditingQuestion(true);
                    }}
                    className="mt-2 shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-500 group-hover:opacity-100"
                    title="Edit question"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}

              {!hasVoted && (
                <p className="mt-3 text-sm text-slate-400">
                  Choose your answer below 👇
                </p>
              )}
            </div>

            {/* Voting Buttons */}
            <div className="space-y-3">
              {options.map((option) => (
                <VoteButton
                  key={option.id}
                  option={option}
                  onVote={handleVote}
                  hasVoted={hasVoted}
                  votedFor={votedFor}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Poll
              </button>
              <button
                onClick={toggleSimulate}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition-all active:scale-95",
                  simulateActive
                    ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                )}
              >
                {simulateActive ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Simulate Votes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Live Results
                    <LiveDot />
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Updates in real-time
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-800 tabular-nums">
                    <AnimatedNumber value={totalVotes} />
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    total votes
                  </div>
                </div>
              </div>

              {totalVotes === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                  <div className="text-4xl">🗳️</div>
                  <p className="mt-3 text-sm font-medium text-slate-400">
                    No votes yet
                  </p>
                  <p className="text-xs text-slate-300">
                    Cast the first vote or simulate!
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {options.map((option) => (
                    <ResultBar
                      key={option.id}
                      option={option}
                      totalVotes={totalVotes}
                      maxVotes={maxVotes}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Participation Stats */}
            {totalVotes > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5 text-center shadow-sm">
                  <div className="text-2xl font-black text-indigo-600 tabular-nums">
                    <AnimatedNumber value={totalVotes} />
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    Total Responses
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-5 text-center shadow-sm">
                  <div className="text-2xl font-black text-purple-600">
                    {options.reduce(
                      (leader, o) =>
                        o.votes > (leader?.votes ?? 0) ? o : leader,
                      options[0]
                    ).iconEmoji}{" "}
                    {options.reduce(
                      (leader, o) =>
                        o.votes > (leader?.votes ?? 0) ? o : leader,
                      options[0]
                    ).label}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    Current Leader
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-xs text-slate-400">
          Built with React & Tailwind CSS • Real-time audience polling
        </div>
      </footer>
    </div>
  );
}
