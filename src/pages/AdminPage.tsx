import { useState, useEffect, type FormEvent } from "react";
import { cn } from "@/utils/cn";
import { usePoll, COLOR_THEMES, type PollOption, type ColorTheme } from "@/context/PollContext";
import { ADMIN_AUTH_KEY, isAdminUnlocked } from "@/utils/adminAuth";

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

const ADMIN_PASSWORD = "amira26";

interface EditableOption {
  id: string;
  label: string;
  colorTheme: ColorTheme;
}

function normalizeEditableOption(option: EditableOption) {
  return {
    id: option.id,
    label: option.label.trim(),
    colorTheme: option.colorTheme,
  };
}

function draftsMatchServer(
  draftQuestion: string,
  draftOptions: EditableOption[],
  serverQuestion: string,
  serverOptions: PollOption[]
) {
  if (draftQuestion.trim() !== serverQuestion.trim()) return false;
  if (draftOptions.length !== serverOptions.length) return false;

  return draftOptions.every((draft, index) => {
    const normalizedDraft = normalizeEditableOption(draft);
    const server = serverOptions[index];
    if (!server) return false;
    return (
      normalizedDraft.id === server.id &&
      normalizedDraft.label === server.label.trim() &&
      normalizedDraft.colorTheme === server.colorTheme
    );
  });
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
        <div className="flex gap-3">
          <input
            type="text"
            value={option.label}
            onChange={(e) => onUpdate({ ...option, label: e.target.value })}
            placeholder="Option label..."
            className="h-12 flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 text-base font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

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

export function AdminPage() {
  const { question: currentQuestion, options: currentOptions, updateConfig, handleReset } = usePoll();

  const [isAuthorized, setIsAuthorized] = useState(isAdminUnlocked);
  const [adminPassword, setAdminPassword] = useState("");
  const [authError, setAuthError] = useState("");

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
  const [isDirty, setIsDirty] = useState(false);

  // Sync state if context changes
  useEffect(() => {
    if (
      isDirty &&
      draftsMatchServer(question, editOptions, currentQuestion, currentOptions)
    ) {
      setIsDirty(false);
      return;
    }

    if (isDirty) return;
    setQuestion(currentQuestion);
    setEditOptions(
      currentOptions.map((o) => ({
        id: o.id,
        label: o.label,
        colorTheme: o.colorTheme,
      }))
    );
  }, [currentQuestion, currentOptions, isDirty]);

  const buildLiveConfig = (draftQuestion: string, draftOptions: EditableOption[]) => {
    if (draftOptions.length < 2) return null;
    const options: PollOption[] = draftOptions.map((option, index) => ({
      id: option.id,
      label: option.label.trim() || `Option ${index + 1}`,
      votes: 0,
      colorTheme: option.colorTheme,
    }));

    return {
      question: draftQuestion.trim() || "Untitled poll question",
      options,
    };
  };

  const addOption = () => {
    if (editOptions.length >= 6) return;
    const usedThemes = editOptions.map((o) => o.colorTheme);
    const availableTheme = ALL_THEMES.find((t) => !usedThemes.includes(t)) || "sky";
    const nextOptions = [
      ...editOptions,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
        label: "",
        colorTheme: availableTheme,
      },
    ];
    setIsDirty(true);
    setEditOptions(nextOptions);
  };

  const removeOption = (index: number) => {
    const nextOptions = editOptions.filter((_, i) => i !== index);
    setIsDirty(true);
    setEditOptions(nextOptions);
  };

  const updateOption = (index: number, updated: EditableOption) => {
    const nextOptions = editOptions.map((o, i) => (i === index ? updated : o));
    setIsDirty(true);
    setEditOptions(nextOptions);
  };

  const loadPreset = (preset: typeof PRESET_POLLS[0]) => {
    const nextQuestion = preset.question;
    const nextOptions = preset.options.map((o, i) => ({
      id: `preset-${i}-${Date.now()}`,
      label: o.label,
      colorTheme: o.colorTheme,
    }));

    setIsDirty(true);
    setQuestion(nextQuestion);
    setEditOptions(nextOptions);
  };

  const handleSave = () => {
    const nextConfig = buildLiveConfig(question, editOptions);
    if (!nextConfig) return;
    updateConfig(nextConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      setAdminPassword("");
      setAuthError("");
      return;
    }
    setAuthError("Incorrect password");
  };

  const handleLock = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAdminPassword("");
    setAuthError("");
  };

  const isValid = editOptions.length >= 2;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/40">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-5">
          <div className="w-full rounded-3xl border border-slate-200/70 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">Admin Access</h1>
            <p className="mt-2 text-sm text-slate-500">Enter the admin password to manage this poll.</p>
            <form className="mt-6 space-y-3" onSubmit={handleUnlock}>
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => {
                  setAdminPassword(event.target.value);
                  if (authError) setAuthError("");
                }}
                placeholder="Password"
                className="h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-base font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              {authError && <p className="text-sm font-medium text-red-500">{authError}</p>}
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-5 text-sm font-bold text-white transition-all hover:from-violet-600 hover:to-indigo-700"
              >
                Unlock Admin
              </button>
            </form>
            <a
              href="#/poll"
              className="mt-4 inline-flex text-sm font-semibold text-indigo-600 transition-all hover:text-indigo-700"
            >
              Back to Poll
            </a>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={handleLock}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Lock
            </button>
            <a
              href="#/admin/graph"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-100"
            >
              Graph View
            </a>
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
                onChange={(e) => {
                  setIsDirty(true);
                  setQuestion(e.target.value);
                }}
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

            {/* Actions */}
            <div className="flex items-center gap-4">
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
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-6 py-3.5 text-base font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Poll
              </button>
              {!isValid && (
                <p className="text-sm text-red-500">
                  {!question.trim()
                    ? "Please enter a question"
                    : "You need at least 2 options with labels"}
                </p>
              )}
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
                            <div className="flex items-center gap-1.5">
                              <span className={cn("font-semibold", theme.color)}>
                                {option.label || "..."}
                              </span>
                            </div>
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
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div className="text-xs text-amber-700">
                    <p className="font-semibold">Tips:</p>
                    <ul className="mt-1 space-y-1 list-disc pl-4">
                      <li>Choose colors that help differentiate options</li>
                      <li>Keep labels short for the best visual results</li>
                      <li>Use Quick Templates to start from a preset</li>
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
          Poll Admin Panel • Changes are saved to Airtable
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
