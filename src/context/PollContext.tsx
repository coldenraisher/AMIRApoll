import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  colorTheme: ColorTheme;
}

export type ColorTheme = "sky" | "emerald" | "red" | "orange" | "purple" | "pink" | "amber" | "teal" | "indigo" | "lime";

export const COLOR_THEMES: Record<ColorTheme, {
  color: string;
  bgColor: string;
  borderColor: string;
  hoverColor: string;
  barColor: string;
  ringColor: string;
}> = {
  sky: {
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    hoverColor: "hover:bg-sky-100 hover:border-sky-300",
    barColor: "from-sky-400 to-sky-600",
    ringColor: "ring-sky-200",
  },
  emerald: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverColor: "hover:bg-emerald-100 hover:border-emerald-300",
    barColor: "from-emerald-400 to-emerald-600",
    ringColor: "ring-emerald-200",
  },
  red: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    hoverColor: "hover:bg-red-100 hover:border-red-300",
    barColor: "from-red-400 to-red-600",
    ringColor: "ring-red-200",
  },
  orange: {
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:bg-orange-100 hover:border-orange-300",
    barColor: "from-orange-400 to-orange-600",
    ringColor: "ring-orange-200",
  },
  purple: {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    hoverColor: "hover:bg-purple-100 hover:border-purple-300",
    barColor: "from-purple-400 to-purple-600",
    ringColor: "ring-purple-200",
  },
  pink: {
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    hoverColor: "hover:bg-pink-100 hover:border-pink-300",
    barColor: "from-pink-400 to-pink-600",
    ringColor: "ring-pink-200",
  },
  amber: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverColor: "hover:bg-amber-100 hover:border-amber-300",
    barColor: "from-amber-400 to-amber-600",
    ringColor: "ring-amber-200",
  },
  teal: {
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    hoverColor: "hover:bg-teal-100 hover:border-teal-300",
    barColor: "from-teal-400 to-teal-600",
    ringColor: "ring-teal-200",
  },
  indigo: {
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    hoverColor: "hover:bg-indigo-100 hover:border-indigo-300",
    barColor: "from-indigo-400 to-indigo-600",
    ringColor: "ring-indigo-200",
  },
  lime: {
    color: "text-lime-700",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    hoverColor: "hover:bg-lime-100 hover:border-lime-300",
    barColor: "from-lime-400 to-lime-600",
    ringColor: "ring-lime-200",
  },
};
const AVAILABLE_THEMES = Object.keys(COLOR_THEMES) as ColorTheme[];

const DEFAULT_QUESTION = "What's your favorite frontend framework?";

const DEFAULT_OPTIONS: PollOption[] = [
  { id: "a", label: "React", votes: 0, colorTheme: "sky" },
  { id: "b", label: "Vue", votes: 0, colorTheme: "emerald" },
  { id: "c", label: "Angular", votes: 0, colorTheme: "red" },
  { id: "d", label: "Svelte", votes: 0, colorTheme: "orange" },
];

interface PollConfig {
  question: string;
  options: PollOption[];
}

interface PersistedPollState {
  question: string;
  options: PollOption[];
}

interface PollContextType {
  question: string;
  options: PollOption[];
  hasVoted: boolean;
  votedFor: string | null;
  showConfetti: boolean;
  totalVotes: number;
  maxVotes: number;
  handleVote: (id: string) => void;
  handleReset: () => void;
  updateConfig: (config: PollConfig) => void;
}

const PollContext = createContext<PollContextType | null>(null);

const POLL_STATE_KEY = "pollState";
const LEGACY_CONFIG_KEY = "pollConfig";
const VOTED_FOR_KEY = "pollVotedFor";

function normalizeOptions(options: PollOption[]): PollOption[] {
  return options.map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    label: option.label,
    votes: Math.max(option.votes || 0, 0),
    colorTheme: option.colorTheme || AVAILABLE_THEMES[index % AVAILABLE_THEMES.length],
  }));
}

function normalizeState(state: PersistedPollState): PersistedPollState {
  const normalizedQuestion = state.question?.trim() || DEFAULT_QUESTION;
  const normalizedOptions = normalizeOptions(state.options || DEFAULT_OPTIONS);

  return {
    question: normalizedQuestion,
    options: normalizedOptions.length >= 2 ? normalizedOptions : DEFAULT_OPTIONS,
  };
}

function loadState(): PersistedPollState {
  try {
    const storedState = localStorage.getItem(POLL_STATE_KEY);
    if (storedState) {
      return normalizeState(JSON.parse(storedState) as PersistedPollState);
    }

    const storedLegacyConfig = localStorage.getItem(LEGACY_CONFIG_KEY);
    if (storedLegacyConfig) {
      const parsed = JSON.parse(storedLegacyConfig) as PollConfig;
      return normalizeState({
        question: parsed.question,
        options: (parsed.options || DEFAULT_OPTIONS).map((option) => ({
          ...option,
          votes: 0,
        })),
      });
    }
  } catch {
    // ignore
  }

  return { question: DEFAULT_QUESTION, options: DEFAULT_OPTIONS };
}

function saveState(state: PersistedPollState) {
  localStorage.setItem(POLL_STATE_KEY, JSON.stringify(state));
  localStorage.setItem(
    LEGACY_CONFIG_KEY,
    JSON.stringify({
      question: state.question,
      options: state.options.map(({ id, label, colorTheme }) => ({
        id,
        label,
        colorTheme,
      })),
    })
  );
}

function loadVotedFor(options: PollOption[]): string | null {
  const votedFor = localStorage.getItem(VOTED_FOR_KEY);
  if (!votedFor) return null;
  return options.some((option) => option.id === votedFor) ? votedFor : null;
}

export function PollProvider({ children }: { children: ReactNode }) {
  const initialStateRef = useRef<PersistedPollState>(loadState());
  const initialVotedForRef = useRef<string | null>(
    loadVotedFor(initialStateRef.current.options)
  );

  const [question, setQuestion] = useState(initialStateRef.current.question);
  const [options, setOptions] = useState<PollOption[]>(initialStateRef.current.options);
  const [hasVoted, setHasVoted] = useState(initialVotedForRef.current !== null);
  const [votedFor, setVotedFor] = useState<string | null>(initialVotedForRef.current);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...options.map((o) => o.votes), 0);

  const handleVote = useCallback(
    (id: string) => {
      if (hasVoted || !options.some((option) => option.id === id)) return;

      setOptions((prev) =>
        prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o))
      );
      setHasVoted(true);
      setVotedFor(id);
      localStorage.setItem(VOTED_FOR_KEY, id);
      setShowConfetti(true);
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 2000);
    },
    [hasVoted, options]
  );

  const handleReset = useCallback(() => {
    setOptions((prev) => prev.map((o) => ({ ...o, votes: 0 })));
    setHasVoted(false);
    setVotedFor(null);
    localStorage.removeItem(VOTED_FOR_KEY);
  }, []);

  const updateConfig = useCallback((config: PollConfig) => {
    const normalized = normalizeState({
      question: config.question,
      options: config.options.map((option) => ({ ...option, votes: 0 })),
    });

    setQuestion(normalized.question);
    setOptions((prevOptions) => {
      const preservedVotes = new Map(prevOptions.map((option) => [option.id, option.votes]));
      return normalized.options.map((option) => ({
        ...option,
        votes: preservedVotes.get(option.id) ?? 0,
      }));
    });
    setHasVoted(false);
    setVotedFor(null);
    localStorage.removeItem(VOTED_FOR_KEY);
    saveState(normalized);
  }, []);

  useEffect(() => {
    saveState({ question, options });
  }, [question, options]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === POLL_STATE_KEY && event.newValue) {
        try {
          const next = normalizeState(JSON.parse(event.newValue) as PersistedPollState);
          setQuestion(next.question);
          setOptions(next.options);
        } catch {
          // ignore malformed payloads
        }
      }

      if (event.key === VOTED_FOR_KEY) {
        const nextVotedFor = event.newValue;
        if (nextVotedFor && options.some((option) => option.id === nextVotedFor)) {
          setVotedFor(nextVotedFor);
          setHasVoted(true);
        } else {
          setVotedFor(null);
          setHasVoted(false);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [options]);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  return (
    <PollContext.Provider
      value={{
        question,
        options,
        hasVoted,
        votedFor,
        showConfetti,
        totalVotes,
        maxVotes,
        handleVote,
        handleReset,
        updateConfig,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error("usePoll must be used within PollProvider");
  return ctx;
}
