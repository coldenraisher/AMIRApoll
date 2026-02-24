import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { usePoll, COLOR_THEMES, type PollOption } from "@/context/PollContext";

function LiveDot() {
  return (
    <span className="relative ml-2 flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
    </span>
  );
}

function HorizontalBar({
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
        <div className="flex items-center gap-3">
          <span className={cn("text-lg font-bold", theme.color)}>
            {option.label}
          </span>
          {isLeading && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              Leading
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-slate-700 tabular-nums">
            <AnimatedNumber value={Math.round(percentage)} />%
          </span>
          <span className="text-sm text-slate-400 tabular-nums">
            <AnimatedNumber value={option.votes} /> vote{option.votes !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="relative h-14 w-full overflow-hidden rounded-2xl bg-slate-100">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-2xl bg-gradient-to-r transition-all duration-700 ease-out",
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
            <span className="ml-auto mr-4 text-sm font-bold text-white drop-shadow-sm">
              <AnimatedNumber value={option.votes} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function VerticalBar({
  option,
  totalVotes,
  maxVotes,
  maxHeight,
}: {
  option: PollOption;
  totalVotes: number;
  maxVotes: number;
  maxHeight: number;
}) {
  const theme = COLOR_THEMES[option.colorTheme];
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const heightPercentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
  const isLeading = option.votes === maxVotes && maxVotes > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Value on top */}
      <div className="text-center">
        <div className="text-2xl font-black text-slate-700 tabular-nums">
          <AnimatedNumber value={Math.round(percentage)} />%
        </div>
        <div className="text-xs text-slate-400 tabular-nums">
          <AnimatedNumber value={option.votes} /> votes
        </div>
      </div>

      {/* Bar */}
      <div
        className="relative w-full overflow-hidden rounded-t-2xl bg-slate-100"
        style={{ height: `${maxHeight}px` }}
      >
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 rounded-t-2xl bg-gradient-to-t transition-all duration-700 ease-out",
            theme.barColor,
            isLeading && "shadow-lg"
          )}
          style={{ height: `${Math.max(heightPercentage, option.votes > 0 ? 5 : 0)}%` }}
        />
      </div>

      {/* Label */}
      <div className="text-center">
        <span className={cn("text-sm font-bold", theme.color)}>
          {option.label}
        </span>
        {isLeading && (
          <div className="mt-1">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              Leading
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DonutChart({
  options,
  totalVotes,
}: {
  options: PollOption[];
  totalVotes: number;
}) {
  const size = 240;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;

  const segments = options.map((option) => {
    const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
    const segment = {
      option,
      percentage,
      offset: circumference * (1 - cumulativePercentage / 100),
      length: circumference * (percentage / 100),
    };
    cumulativePercentage += percentage;
    return segment;
  });

  const colorMap: Record<string, string> = {
    sky: "#38bdf8",
    emerald: "#34d399",
    red: "#f87171",
    orange: "#fb923c",
    purple: "#a78bfa",
    pink: "#f472b6",
    amber: "#fbbf24",
    teal: "#2dd4bf",
    indigo: "#818cf8",
    lime: "#a3e635",
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.option.id}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colorMap[seg.option.colorTheme] || "#94a3b8"}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              strokeDashoffset={seg.offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          ))}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-slate-800 tabular-nums">
            <AnimatedNumber value={totalVotes} />
          </div>
          <div className="text-xs font-medium text-slate-400">total votes</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {options.map((option) => {
          const theme = COLOR_THEMES[option.colorTheme];
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          return (
            <div key={option.id} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full bg-gradient-to-r", theme.barColor)} />
              <span className="text-sm font-medium text-slate-600">
                {option.label}
              </span>
              <span className="text-sm font-bold text-slate-800 tabular-nums">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ResultsPage() {
  const { question, options, totalVotes, maxVotes } = usePoll();
  const [chartView, setChartView] = useState<"horizontal" | "vertical" | "donut">("horizontal");

  // Auto-refresh every 2 seconds to pick up new votes
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Live Results</h1>
              <p className="text-xs text-white/40">Presentation View</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#/admin"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition-all hover:border-white/40 hover:bg-white/20 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Admin</span>
            </a>
            <div className="flex items-center gap-2 text-sm font-medium text-white/50">
              <span className="hidden sm:inline">LIVE</span>
              <LiveDot />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Question */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            {question}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="text-lg font-bold text-white/60 tabular-nums">
              <AnimatedNumber value={totalVotes} /> total votes
            </div>
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl bg-white/10 p-1 backdrop-blur-sm">
            {(["horizontal", "vertical", "donut"] as const).map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-all",
                  chartView === view
                    ? "bg-white text-slate-800 shadow-md"
                    : "text-white/60 hover:text-white"
                )}
              >
                {view === "horizontal" ? "Bar Chart" : view === "vertical" ? "Column Chart" : "Donut Chart"}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-10">
          {totalVotes === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-lg font-semibold text-white/40">
                Waiting for votes...
              </p>
              <p className="mt-1 text-sm text-white/20">
                Results will appear here as votes come in
              </p>
            </div>
          ) : (
            <>
              {chartView === "horizontal" && (
                <div className="space-y-6">
                  {options.map((option) => (
                    <HorizontalBar
                      key={option.id}
                      option={option}
                      totalVotes={totalVotes}
                      maxVotes={maxVotes}
                    />
                  ))}
                </div>
              )}

              {chartView === "vertical" && (
                <div className="flex items-end justify-center gap-6">
                  {options.map((option) => (
                    <div key={option.id} className="flex-1 max-w-[180px]">
                      <VerticalBar
                        option={option}
                        totalVotes={totalVotes}
                        maxVotes={maxVotes}
                        maxHeight={280}
                      />
                    </div>
                  ))}
                </div>
              )}

              {chartView === "donut" && (
                <DonutChart options={options} totalVotes={totalVotes} />
              )}
            </>
          )}
        </div>

        {/* Stats Row */}
        {totalVotes > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {options.map((option) => {
              const theme = COLOR_THEMES[option.colorTheme];
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              const isLeading = option.votes === maxVotes && maxVotes > 0;
              return (
                <div
                  key={option.id}
                  className={cn(
                    "rounded-2xl border p-5 text-center transition-all",
                    isLeading
                      ? "border-white/20 bg-white/10"
                      : "border-white/5 bg-white/5"
                  )}
                >
                  <div className={cn("text-2xl font-black tabular-nums", theme.color)}>
                    <AnimatedNumber value={percentage} />%
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/60">
                    {option.label}
                  </div>
                  <div className="mt-0.5 text-xs text-white/30 tabular-nums">
                    <AnimatedNumber value={option.votes} /> votes
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
