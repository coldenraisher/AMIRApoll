import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  colorTheme: ColorTheme;
}

export type ColorTheme =
  | "sky"
  | "emerald"
  | "red"
  | "orange"
  | "purple"
  | "pink"
  | "amber"
  | "teal"
  | "indigo"
  | "lime";

export const COLOR_THEMES: Record<
  ColorTheme,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    hoverColor: string;
    barColor: string;
    ringColor: string;
  }
> = {
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
const DEFAULT_POLL_ID = import.meta.env.VITE_POLL_ID || "default-poll";
const API_BASE = "/.netlify/functions";
const VOTER_ID_KEY = "pollVoterId";
const VOTED_FOR_KEY_PREFIX = "pollVotedFor";

interface PollConfig {
  question: string;
  options: PollOption[];
}

interface PollStateResponse {
  pollId: string;
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

function getVotedForKey(pollId: string): string {
  return `${VOTED_FOR_KEY_PREFIX}:${pollId}`;
}

function getOrCreateVoterId(): string {
  const existing = localStorage.getItem(VOTER_ID_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  localStorage.setItem(VOTER_ID_KEY, next);
  return next;
}

function normalizeOptions(options: PollOption[]): PollOption[] {
  return options.map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    label: option.label?.trim() || `Option ${index + 1}`,
    votes: Math.max(option.votes || 0, 0),
    colorTheme: option.colorTheme || AVAILABLE_THEMES[index % AVAILABLE_THEMES.length],
  }));
}

function normalizeState(state: Partial<PollStateResponse>): PollStateResponse {
  const question = typeof state.question === "string" && state.question.trim() ? state.question.trim() : DEFAULT_QUESTION;
  const options = normalizeOptions(Array.isArray(state.options) ? state.options : DEFAULT_OPTIONS);
  const pollId = state.pollId || DEFAULT_POLL_ID;

  return {
    pollId,
    question,
    options: options.length >= 2 ? options : DEFAULT_OPTIONS,
  };
}

async function fetchPollState(pollId: string): Promise<PollStateResponse> {
  const response = await fetch(`${API_BASE}/poll-state?pollId=${encodeURIComponent(pollId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch poll state: ${response.status}`);
  }

  const payload = (await response.json()) as Partial<PollStateResponse>;
  return normalizeState(payload);
}

export function PollProvider({ children }: { children: ReactNode }) {
  const pollId = DEFAULT_POLL_ID;
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [options, setOptions] = useState<PollOption[]>(DEFAULT_OPTIONS);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const votedForKey = useMemo(() => getVotedForKey(pollId), [pollId]);

  const syncLocalVoteState = useCallback(
    (nextOptions: PollOption[]) => {
      const localVote = localStorage.getItem(votedForKey);
      if (localVote && nextOptions.some((option) => option.id === localVote)) {
        setVotedFor(localVote);
        setHasVoted(true);
        return;
      }

      localStorage.removeItem(votedForKey);
      setVotedFor(null);
      setHasVoted(false);
    },
    [votedForKey]
  );

  const applyState = useCallback(
    (state: PollStateResponse) => {
      const normalized = normalizeState(state);
      setQuestion(normalized.question);
      setOptions(normalized.options);
      syncLocalVoteState(normalized.options);
    },
    [syncLocalVoteState]
  );

  const refreshState = useCallback(async () => {
    try {
      const state = await fetchPollState(pollId);
      applyState(state);
    } catch {
      // Keep the current in-memory UI state if backend is unavailable.
    }
  }, [applyState, pollId]);

  useEffect(() => {
    void refreshState();
    const interval = setInterval(() => {
      void refreshState();
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshState]);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...options.map((option) => option.votes), 0);

  const handleVote = useCallback(
    (id: string) => {
      if (hasVoted || !options.some((option) => option.id === id)) return;

      setOptions((prev) => prev.map((option) => (option.id === id ? { ...option, votes: option.votes + 1 } : option)));
      setHasVoted(true);
      setVotedFor(id);
      localStorage.setItem(votedForKey, id);
      setShowConfetti(true);
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), 2000);

      const voterId = getOrCreateVoterId();
      const voteId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

      void fetch(`${API_BASE}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId,
          optionId: id,
          voterId,
          voteId,
        }),
      })
        .then(async (response) => {
          const body = (await response.json()) as { state?: PollStateResponse };
          if (!response.ok) {
            throw new Error("Vote failed");
          }
          if (body.state) applyState(body.state);
        })
        .catch(async () => {
          localStorage.removeItem(votedForKey);
          setHasVoted(false);
          setVotedFor(null);
          await refreshState();
        });
    },
    [applyState, hasVoted, options, pollId, refreshState, votedForKey]
  );

  const handleReset = useCallback(() => {
    void fetch(`${API_BASE}/reset-votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    })
      .then(async (response) => {
        const body = (await response.json()) as { state?: PollStateResponse };
        if (!response.ok) throw new Error("Failed reset");
        if (body.state) {
          applyState(body.state);
        } else {
          await refreshState();
        }
      })
      .catch(async () => {
        await refreshState();
      })
      .finally(() => {
        localStorage.removeItem(votedForKey);
        setHasVoted(false);
        setVotedFor(null);
      });
  }, [applyState, pollId, refreshState, votedForKey]);

  const updateConfig = useCallback(
    (config: PollConfig) => {
      const normalizedConfig = normalizeState({
        pollId,
        question: config.question,
        options: config.options.map((option) => ({ ...option, votes: 0 })),
      });

      void fetch(`${API_BASE}/poll-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pollId,
          question: normalizedConfig.question,
          options: normalizedConfig.options.map(({ id, label, colorTheme }) => ({
            id,
            label,
            colorTheme,
          })),
        }),
      })
        .then(async (response) => {
          const body = (await response.json()) as { state?: PollStateResponse };
          if (!response.ok) throw new Error("Failed update");
          if (body.state) {
            applyState(body.state);
          } else {
            await refreshState();
          }
        })
        .catch(async () => {
          await refreshState();
        })
        .finally(() => {
          localStorage.removeItem(votedForKey);
          setHasVoted(false);
          setVotedFor(null);
        });
    },
    [applyState, pollId, refreshState, votedForKey]
  );

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
