import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CURATED_TOPICS } from "../types";

const GITHUB_URL = "https://github.com/nwenner/harmonic";

interface Props {
  onStart: (topic: string, stance: string) => void;
  isLoading: boolean;
}

const LOADING_PHRASES = [
  "Finding your conversation partner...",
  "Learning about their background...",
  "Getting to know their perspective...",
  "Almost ready...",
];

export function TopicSelector({ onStart, isLoading }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [stance, setStance] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const activeTopic = showCustom ? customTopic : selectedTopic;

  useEffect(() => {
    if (!isLoading) {
      setPhraseIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setPhraseIndex((i) => Math.min(i + 1, LOADING_PHRASES.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topic = activeTopic.trim();
    if (!topic) return;
    onStart(topic, stance.trim());
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-cdi-purple text-white px-6 py-12 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Harmonic
        </h1>
        <p className="text-cdi-gold text-base sm:text-lg max-w-lg mx-auto leading-relaxed font-medium">
          Finding the notes that fit together, even when they're not the same.
        </p>
        <p className="text-indigo-200 text-sm max-w-md mx-auto mt-3">
          Practice real conversation with someone who genuinely sees it differently.
        </p>
        <div className="flex items-center justify-center gap-5 mt-5">
          <Link
            to="/about"
            className="text-indigo-300 hover:text-white text-xs transition-colors"
          >
            About this project
          </Link>
          <span className="text-indigo-400 text-xs">·</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-indigo-300 hover:text-white text-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Topic picker */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
              Choose a topic
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CURATED_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(t);
                    setShowCustom(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    !showCustom && selectedTopic === t
                      ? "bg-cdi-purple text-white border-cdi-purple"
                      : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-cdi-purple dark:hover:border-cdi-purple"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setShowCustom(true);
                  setSelectedTopic("");
                }}
                className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all sm:col-span-2 ${
                  showCustom
                    ? "bg-cdi-purple text-white border-cdi-purple"
                    : "bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 border-dashed hover:border-cdi-purple dark:hover:border-cdi-purple"
                }`}
              >
                + Something else
              </button>
            </div>
            {showCustom && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter your topic..."
                autoFocus
                className="mt-3 w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Your stance{" "}
              <span className="font-normal normal-case text-stone-400 dark:text-stone-500">
                (optional)
              </span>
            </h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">
              Helps us find someone with a genuinely different view
            </p>
            <textarea
              value={stance}
              onChange={(e) => setStance(e.target.value)}
              placeholder="e.g. I think we need stricter background checks and permit requirements..."
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 dark:border-stone-600 rounded-lg text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!activeTopic.trim() || isLoading}
            className="w-full bg-cdi-gold text-stone-900 py-4 rounded-lg font-semibold text-sm tracking-wide hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                </span>
                {LOADING_PHRASES[phraseIndex]}
              </span>
            ) : (
              "Start the conversation →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
