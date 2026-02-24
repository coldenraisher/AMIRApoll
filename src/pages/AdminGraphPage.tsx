import { useState } from "react";
import { usePoll, COLOR_THEMES } from "@/context/PollContext";
import { cn } from "@/utils/cn";
import { isAdminUnlocked } from "@/utils/adminAuth";

const PIE_COLORS = {
  sky: "#0369a1",
  emerald: "#047857",
  red: "#b91c1c",
  orange: "#c2410c",
  purple: "#7e22ce",
  pink: "#be185d",
  amber: "#b45309",
  teal: "#0f766e",
  indigo: "#3730a3",
  lime: "#4d7c0f",
} as const;

function UnauthorizedView() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-5">
        <div className="w-full rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold">Admin Access Required</h1>
          <p className="mt-2 text-sm text-slate-300">
            Unlock admin first to open the live graph screen.
          </p>
          <a
            href="#/admin"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500"
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}

export function AdminGraphPage() {
  const [isAuthorized] = useState(isAdminUnlocked);
  const [chartMode, setChartMode] = useState<"bar" | "pie">("bar");
  const { question, options, totalVotes, maxVotes } = usePoll();

  if (!isAuthorized) return <UnauthorizedView />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="graph-blob graph-blob-indigo" />
      <div className="graph-blob graph-blob-cyan" />

      <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
        <a
          href="#/admin"
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur transition-all hover:border-indigo-400"
        >
          Back to Admin
        </a>
      </div>

      <div className="mx-auto flex h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Vote Graph</p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-4xl">{question}</h1>
          </div>
          <div className="graph-glow rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-right">
            <p className="text-xs text-slate-400">Total Votes</p>
            <p className="text-2xl font-black tabular-nums sm:text-4xl">{totalVotes}</p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            onClick={() => setChartMode("bar")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
              chartMode === "bar"
                ? "border-indigo-300 bg-indigo-500 text-white"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            )}
          >
            Bar
          </button>
          <button
            onClick={() => setChartMode("pie")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
              chartMode === "pie"
                ? "border-indigo-300 bg-indigo-500 text-white"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            )}
          >
            Pie
          </button>
        </div>

        {chartMode === "bar" ? (
          <div className="grid flex-1 gap-4">
            {options.map((option) => {
              const theme = COLOR_THEMES[option.colorTheme];
              const widthPercentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
              return (
                <div key={option.id} className="graph-glow flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3">
                  <div className="w-40 shrink-0 text-sm font-semibold text-slate-200 sm:w-56 sm:text-lg">
                    {option.label}
                  </div>
                  <div className="relative h-14 flex-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                    <div
                      className={cn(
                        "graph-bar-fill absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r transition-all duration-700 ease-out",
                        theme.barColor
                      )}
                      style={{ width: `${Math.max(widthPercentage, option.votes > 0 ? 2 : 0)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end px-4">
                      <span className="text-lg font-bold tabular-nums text-white sm:text-2xl">
                        {option.votes}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center">
            <PieChart options={options} totalVotes={totalVotes} />
            <div className="space-y-3">
              {options.map((option) => {
                const theme = COLOR_THEMES[option.colorTheme];
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                return (
                  <div
                    key={option.id}
                    className={cn(
                      "graph-glow flex items-center justify-between rounded-xl border px-4 py-3",
                      theme.borderColor,
                      "bg-slate-900/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[option.colorTheme] }}
                      />
                      <span className="text-sm font-semibold text-slate-100 sm:text-base">{option.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold tabular-nums text-white">{option.votes}</p>
                      <p className="text-xs text-slate-400">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PieChart({
  options,
  totalVotes,
}: {
  options: Array<{ id: string; votes: number; colorTheme: keyof typeof COLOR_THEMES }>;
  totalVotes: number;
}) {
  const size = 320;
  const radius = 120;
  const center = size / 2;

  let runningAngle = -Math.PI / 2;
  const slices = options.map((option) => {
    const value = totalVotes > 0 ? option.votes / totalVotes : 1 / options.length;
    const angle = value * Math.PI * 2;
    const start = runningAngle;
    const end = runningAngle + angle;
    runningAngle = end;

    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    return {
      id: option.id,
      path,
      color: PIE_COLORS[option.colorTheme],
    };
  });

  return (
    <div className="flex h-full items-center justify-center">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-72 w-72 sm:h-80 sm:w-80">
          {slices.map((slice, index) => (
            <path
              key={slice.id}
              d={slice.path}
              className="graph-pie-slice"
              style={{ fill: slice.color, animationDelay: `${index * 80}ms` }}
            />
          ))}
          <circle cx={center} cy={center} r={58} className="fill-slate-950" />
          <text
            x={center}
            y={center - 8}
            textAnchor="middle"
            className="fill-white text-2xl font-black tabular-nums"
          >
            {totalVotes}
          </text>
          <text x={center} y={center + 14} textAnchor="middle" className="fill-slate-400 text-xs">
            total votes
          </text>
        </svg>
      </div>
    </div>
  );
}
