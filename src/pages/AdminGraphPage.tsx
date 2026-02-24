import { useState } from "react";
import { usePoll, COLOR_THEMES } from "@/context/PollContext";
import { cn } from "@/utils/cn";
import { isAdminUnlocked } from "@/utils/adminAuth";

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
  const { question, options, totalVotes, maxVotes } = usePoll();

  if (!isAuthorized) return <UnauthorizedView />;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
        <a
          href="#/admin"
          className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-100 backdrop-blur"
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
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-right">
            <p className="text-xs text-slate-400">Total Votes</p>
            <p className="text-2xl font-black tabular-nums sm:text-4xl">{totalVotes}</p>
          </div>
        </div>

        <div className="grid flex-1 gap-4">
          {options.map((option) => {
            const theme = COLOR_THEMES[option.colorTheme];
            const widthPercentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
            return (
              <div key={option.id} className="flex items-center gap-4">
                <div className="w-40 shrink-0 text-sm font-semibold text-slate-200 sm:w-56 sm:text-lg">
                  {option.label}
                </div>
                <div className="relative h-14 flex-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r transition-all duration-700 ease-out",
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
      </div>
    </div>
  );
}
