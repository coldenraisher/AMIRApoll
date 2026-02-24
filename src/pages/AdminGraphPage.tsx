import { useState } from "react";
import { usePoll, COLOR_THEMES } from "@/context/PollContext";
import { cn } from "@/utils/cn";
import { isAdminUnlocked } from "@/utils/adminAuth";

const PIE_COLORS = {
  sky: "#00d4ff",
  emerald: "#00ffa3",
  red: "#ff3b6b",
  orange: "#ff7a00",
  purple: "#b026ff",
  pink: "#ff2bd6",
  amber: "#ffd000",
  teal: "#00f0ff",
  indigo: "#6b7cff",
  lime: "#b7ff00",
} as const;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
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
          <div className="graph-glow rounded-xl border border-cyan-400/30 bg-slate-900/80 px-4 py-2 text-right">
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
                  <div className="relative h-14 flex-1 overflow-hidden rounded-xl border border-cyan-400/25 bg-slate-900">
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
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                const neon = PIE_COLORS[option.colorTheme];
                return (
                  <div
                    key={option.id}
                    className={cn("graph-glow flex items-center justify-between rounded-xl border px-4 py-3")}
                    style={{
                      borderColor: hexToRgba(neon, 0.55),
                      background: `linear-gradient(135deg, ${hexToRgba(neon, 0.12)}, rgba(8,16,40,0.8) 48%)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-[0_0_12px]"
                        style={{ backgroundColor: neon, boxShadow: `0 0 16px ${hexToRgba(neon, 0.85)}` }}
                      />
                      <span className="text-sm font-semibold text-slate-100 sm:text-base">{option.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold tabular-nums text-white">{option.votes}</p>
                      <p className="text-xs font-medium text-slate-300">{percentage}%</p>
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
  const slices = options.map((option) => ({
    id: option.id,
    votes: option.votes,
    color: PIE_COLORS[option.colorTheme],
  }));
  const gradientStops: string[] = [];
  let runningPercent = 0;

  for (const slice of slices) {
    const portion = totalVotes > 0 ? (slice.votes / totalVotes) * 100 : 100 / Math.max(slices.length, 1);
    const start = runningPercent;
    const end = runningPercent + portion;
    gradientStops.push(`${slice.color} ${start}% ${end}%`);
    runningPercent = end;
  }

  const donutBackground =
    slices.length > 0
      ? `conic-gradient(from -90deg, ${gradientStops.join(", ")})`
      : "conic-gradient(from -90deg, #1f2937 0% 100%)";

  return (
    <div className="flex h-full items-center justify-center">
      <div className="graph-glow relative rounded-2xl border border-cyan-400/40 bg-slate-900/80 p-5">
        <div className="graph-pie-halo" />
        <div
          className="graph-pie-donut relative h-72 w-72 rounded-full sm:h-80 sm:w-80"
          style={{ background: donutBackground }}
        >
          <div className="absolute inset-0 rounded-full opacity-75 [mask-image:radial-gradient(circle,transparent_52%,black_72%)] bg-[linear-gradient(120deg,rgba(255,255,255,0.2),transparent_45%)]" />
          <div className="absolute inset-[27%] rounded-full border border-cyan-300/20 bg-[#030617]/90 shadow-[inset_0_0_30px_rgba(0,0,0,0.55)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-black tabular-nums text-white">{totalVotes}</p>
            <p className="text-xs tracking-wide text-cyan-200/80">total votes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
