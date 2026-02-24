import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { usePoll, COLOR_THEMES, type PollOption, type ColorTheme } from "@/context/PollContext";

const ADMIN_PASSWORD = "amira";

const ALL_THEMES: ColorTheme[] = ["sky", "emerald", "red", "orange", "purple", "pink", "amber", "teal", "indigo", "lime"];

const PRESET_POLLS = [
  {
    name: "Frontend Framework",
    question: "What's your favorite frontend framework?",
    options: [
      { label: "React", colorTheme: "sky" as ColorTheme },
      { label: "Vue", colorTheme: "emerald" as ColorTheme },
      { label: "Angular", colorTheme: "red" as ColorTheme },
      { label: "Svelte", colorTheme: "orange" as ColorTheme },
    ],
  },
  {
    name: "Yes / No / Maybe",
    question: "Do you agree with the proposal?",
    options: [
      { label: "Yes", colorTheme: "emerald" as ColorTheme },
      { label: "No", colorTheme: "red" as ColorTheme },
      { label: "Maybe", colorTheme: "amber" as ColorTheme },
    ],
  },
  {
    name: "Rating Scale",
    question: "How would you rate today's presentation?",
    options: [
      { label: "Excellent", colorTheme: "emerald" as ColorTheme },
      { label: "Good", colorTheme: "sky" as ColorTheme },
      { label: "Average", colorTheme: "amber" as ColorTheme },
      { label: "Needs Improvement", colorTheme: "red" as ColorTheme },
    ],
  },
  {
    name: "Lunch Vote",
    question: "Where should we go for team lunch?",
    options: [
      { label: "Pizza", colorTheme: "red" as ColorTheme },
      { label: "Burgers", colorTheme: "amber" as ColorTheme },
      { label: "Tacos", colorTheme: "orange" as ColorTheme },
      { label: "Sushi", colorTheme: "pink" as ColorTheme },
    ],
  },
];

interface EditableOption {
  id: string;
  label: string;
  colorTheme: ColorTheme;
}

function ColorPicker({ value, onChange }: { value: ColorTheme; onChange: (theme: ColorTheme) => void }) {
  const colorPreview: Record<ColorTheme, string> = {
    sky: "bg-sky-400",
    emerald: "bg-emerald-400",
    red: "bg-red-400",
    orange: "bg-orange-400",
    purple: "bg-purple-400",
    pink: "bg-pink-400",
    amber: "bg-amber-400",
    teal: "bg-teal-400",
    indigo: "bg-indigo-400",
    lime: "bg-lime-400",
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_THEMES.map((theme) => (
        <button
          key={theme}
          onClick={() => onChange(theme)}
          className={cn(
            "h-7 w-7 rounded-full transition-all hover:scale-110",
            colorPreview[theme],
            value === theme ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "opacity-60 hover:opacity-100"
          )}
          title={theme}
        />
      ))}
    </div>
  );
}

function OptionEditor({
  option,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  option: EditableOption;
  index: number;
  onUpdate: (option: EditableOption) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const theme = COLOR_THEMES[option.colorTheme];

  return (
    <div className={cn("rounded-2xl border-2 p-5 transition-all", theme.borderColor, theme.bgColor)}>
      <div className="mb-3 flex items-center justify-between">
        <span className={cn("text-xs font-bold uppercase tracking-wider", theme.color)}>
          Option {index + 1}
        </span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-red-100 hover:text-red-500"
            title="Remove option"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Label Input */}
        <input
          type="text"
          value={option.label}
          onChange={(e) => onUpdate({ ...option, label: e.target.value })}
          placeholder="Option label..."
          className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        {/* Color Picker */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Color Theme</label>
          <ColorPicker
            value={option.colorTheme}
            onChange={(colorTheme) => onUpdate({ ...option, colorTheme })}
          />
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40 px-4">
      <div
        className={cn(
          "w-full max-w-md rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl transition-transform sm:p-10",
          shake && "animate-[shake_0.5s_ease-in-out]"
        )}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Admin Access</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter the password to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter admin password"
              className={cn(
                "w-full rounded-xl border-2 px-4 py-3 text-base font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:ring-2",
                error
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-violet-400 focus:ring-violet-100"
              )}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm font-medium text-red-500">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:from-violet-600 hover:to-indigo-700 hover:shadow-xl active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#/poll"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-indigo-500"
          >
            Back to Poll
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  // Check sessionStorage for existing auth
  useEffect(() => {
    const isAuth = sessionStorage.getItem("pollAdminAuth");
    if (isAuth === "true") setAuthenticated(true);
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
    sessionStorage.setItem("pollAdminAuth", "true");
  };

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const { question: currentQuestion, options: currentOptions, totalVotes, updateConfig, handleReset } = usePoll();

  const [question, setQuestion] = useState(currentQuestion);
  const [editOptions, setEditOptions] = useState<EditableOption[]>(
    currentOptions.map((o) => ({
      id: o.id,
      label: o.label,
      colorTheme: o.colorTheme,
    }))
  );
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync state if context changes
  useEffect(() => {
    setQuestion(currentQuestion);
    setEditOptions(
      currentOptions.map((o) => ({
        id: o.id,
        label: o.label,
        colorTheme: o.colorTheme,
      }))
    );
  }, [currentQuestion, currentOptions]);

  const addOption = () => {
    if (editOptions.length >= 6) return;
    const usedThemes = editOptions.map((o) => o.colorTheme);
    const availableTheme = ALL_THEMES.find((t) => !usedThemes.includes(t)) || "sky";
    setEditOptions([
      ...editOptions,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
        label: "",
        colorTheme: availableTheme,
      },
    ]);
  };

  const removeOption = (index: number) => {
    setEditOptions(editOptions.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, updated: EditableOption) => {
    setEditOptions(editOptions.map((o, i) => (i === index ? updated : o)));
  };

  const loadPreset = (preset: typeof PRESET_POLLS[0]) => {
    setQuestion(preset.question);
    setEditOptions(
      preset.options.map((o, i) => ({
        id: `preset-${i}-${Date.now()}`,
        label: o.label,
        colorTheme: o.colorTheme,
      }))
    );
  };

  const handleSave = () => {
    const validOptions = editOptions.filter((o) => o.label.trim() !== "");
    if (validOptions.length < 2 || !question.trim()) return;

    const newOptions: PollOption[] = validOptions.map((o) => ({
      id: o.id,
      label: o.label.trim(),
      votes: 0,
      colorTheme: o.colorTheme,
    }));

    updateConfig({ question: question.trim(), options: newOptions });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const confirmReset = () => {
    handleReset();
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pollAdminAuth");
    window.location.hash = "#/poll";
  };

  const isValid = question.trim() !== "" && editOptions.filter((o) => o.label.trim() !== "").length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Poll Admin</h1>
              <p className="text-xs text-slate-400">Configure your poll</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#/results"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Results View</span>
            </a>
            <a
              href="#/poll"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">View Poll</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
              title="Sign out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Editor */}
          <div className="space-y-6 lg:col-span-3">
            {/* Quick Templates */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Quick Templates
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_POLLS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 active:scale-95"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Editor */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Poll Question
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                rows={2}
                className="w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50/50 px-5 py-4 text-xl font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Options Editor */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Answer Options ({editOptions.length})
                </div>
                <span className="text-xs text-slate-400">Min 2, Max 6</span>
              </div>

              <div className="space-y-4">
                {editOptions.map((option, index) => (
                  <OptionEditor
                    key={option.id}
                    option={option}
                    index={index}
                    onUpdate={(updated) => updateOption(index, updated)}
                    onRemove={() => removeOption(index)}
                    canRemove={editOptions.length > 2}
                  />
                ))}
              </div>

              {editOptions.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-400 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Option
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleSave}
                disabled={!isValid}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-bold shadow-lg transition-all active:scale-95",
                  isValid
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 hover:shadow-xl"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                )}
              >
                {saved ? (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved & Applied!
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Save & Apply Poll
                  </>
                )}
              </button>
              {!isValid && (
                <p className="text-sm text-red-500">
                  {!question.trim()
                    ? "Please enter a question"
                    : "You need at least 2 options with labels"}
                </p>
              )}
            </div>

            {/* Reset Poll Section */}
            <div className="rounded-3xl border border-red-200/60 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Danger Zone
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Reset Poll Votes</h3>
                  <p className="text-xs text-slate-400">
                    Clear all {totalVotes} vote{totalVotes !== 1 ? "s" : ""} and allow everyone to vote again.
                  </p>
                </div>
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 hover:shadow-sm active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Votes
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-600">Are you sure?</span>
                    <button
                      onClick={confirmReset}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-95"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-500">Live Preview</span>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="rounded-lg px-3 py-1 text-xs font-medium text-slate-500 transition-all hover:bg-slate-100"
                >
                  {previewMode ? "Show Buttons" : "Show Results"}
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm">
                {/* Preview Question */}
                <h3 className="mb-4 text-lg font-bold text-slate-800">
                  {question || "Your question here..."}
                </h3>

                {!previewMode ? (
                  /* Preview Buttons */
                  <div className="space-y-2">
                    {editOptions.map((option) => {
                      const theme = COLOR_THEMES[option.colorTheme];
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all",
                            theme.bgColor,
                            theme.borderColor
                          )}
                        >
                          <span className={cn("text-sm font-semibold", theme.color)}>
                            {option.label || "..."}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Preview Results */
                  <div className="space-y-3">
                    {editOptions.map((option, i) => {
                      const theme = COLOR_THEMES[option.colorTheme];
                      const fakePercentage = [42, 28, 18, 12, 8, 5][i] || 10;
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={cn("font-semibold", theme.color)}>
                              {option.label || "..."}
                            </span>
                            <span className="font-bold text-slate-600">{fakePercentage}%</span>
                          </div>
                          <div className="h-6 w-full overflow-hidden rounded-lg bg-slate-100">
                            <div
                              className={cn(
                                "h-full rounded-lg bg-gradient-to-r transition-all duration-500",
                                theme.barColor
                              )}
                              style={{ width: `${fakePercentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-violet-700">
                    <p className="font-semibold">Tips:</p>
                    <ul className="mt-1 space-y-1 list-disc pl-4">
                      <li>Choose colors that help differentiate options</li>
                      <li>Keep labels short for the best visual results</li>
                      <li>Use Quick Templates to start from a preset</li>
                      <li>Open the Results View for a presentation-friendly display</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4 text-center text-xs text-slate-400">
          Poll Admin Panel — Changes are saved to your browser
        </div>
      </footer>

      {/* Save Success Toast */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 shadow-2xl transition-all duration-500",
          saved ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">Poll Updated!</p>
          <p className="text-xs text-emerald-600">Changes are live now</p>
        </div>
      </div>
    </div>
  );
}
