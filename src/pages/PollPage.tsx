import { cn } from "@/utils/cn";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { usePoll, COLOR_THEMES, type PollOption } from "@/context/PollContext";

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
  const theme = COLOR_THEMES[option.colorTheme];

  return (
    <button
      onClick={() => onVote(option.id)}
      disabled={hasVoted}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-2xl border-2 px-6 py-5 text-left transition-all duration-300",
        hasVoted && !isSelected && "opacity-50 cursor-not-allowed",
        hasVoted && isSelected &&
          `${theme.bgColor} ${theme.borderColor} ring-2 ring-offset-2 ${theme.ringColor} cursor-default`,
        !hasVoted &&
          `${theme.bgColor} ${theme.borderColor} ${theme.hoverColor} cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
      )}
    >
      <span className="text-2xl">{option.emoji}</span>
      <span className={cn("text-lg font-semibold", theme.color)}>
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
  const theme = COLOR_THEMES[option.colorTheme];
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const widthPercentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
  const isLeading = option.votes === maxVotes && maxVotes > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{option.emoji}</span>
          <span className={cn("text-sm font-semibold", theme.color)}>
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
            theme.barColor,
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

export function PollPage() {
  const {
    question,
    options,
    hasVoted,
    votedFor,
    showConfetti,
    totalVotes,
    maxVotes,
    handleVote,
  } = usePoll();

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
          <div className="flex items-center gap-4">
            <a
              href="#/admin"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Admin</span>
            </a>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="hidden sm:inline">LIVE</span>
              <LiveDot />
            </div>
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
              <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                {question}
              </h2>
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
                    Cast the first vote!
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

            {/* Stats */}
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
                      (leader, o) => (o.votes > (leader?.votes ?? 0) ? o : leader),
                      options[0]
                    ).emoji}{" "}
                    {options.reduce(
                      (leader, o) => (o.votes > (leader?.votes ?? 0) ? o : leader),
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
