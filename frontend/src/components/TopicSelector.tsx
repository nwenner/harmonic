import { useState } from "react";
import { CURATED_TOPICS } from "../types";

interface Props {
  onStart: (topic: string, stance: string) => void;
  isLoading: boolean;
}

export function TopicSelector({ onStart, isLoading }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [stance, setStance] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const activeTopic = showCustom ? customTopic : selectedTopic;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topic = activeTopic.trim();
    if (!topic) return;
    onStart(topic, stance.trim());
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-stone-900 text-stone-50 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          The Other Side
        </h1>
        <p className="text-stone-400 text-lg max-w-md mx-auto">
          Practice the hardest kind of conversation — with someone who genuinely
          sees it differently.
        </p>
      </div>

      {/* Topic picker */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
              Choose a topic
            </h2>
            <div className="grid grid-cols-2 gap-2">
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
                      ? "bg-stone-900 text-stone-50 border-stone-900"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
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
                className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all col-span-2 ${
                  showCustom
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : "bg-white text-stone-500 border-stone-200 border-dashed hover:border-stone-400"
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
                className="mt-3 w-full px-4 py-3 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Your stance{" "}
              <span className="font-normal normal-case text-stone-400">
                (optional)
              </span>
            </h2>
            <p className="text-xs text-stone-400 mb-3">
              Helps us find someone with a genuinely different view
            </p>
            <textarea
              value={stance}
              onChange={(e) => setStance(e.target.value)}
              placeholder="e.g. I think we need stricter background checks and permit requirements..."
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!activeTopic.trim() || isLoading}
            className="w-full bg-stone-900 text-stone-50 py-4 rounded-lg font-semibold text-sm tracking-wide hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                </span>
                Finding your conversation partner...
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
