import { useEffect, useState } from "react";
import type { Persona } from "../types";

interface Props {
  persona: Persona;
  topic: string;
  messageCount: number;
  onGetReflections: () => Promise<string[]>;
  onStartOver: () => void;
}

export function ConversationEnd({
  persona,
  topic,
  messageCount,
  onGetReflections,
  onStartOver,
}: Props) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [perspectiveShift, setPerspectiveShift] = useState<string | null>(null);

  useEffect(() => {
    onGetReflections()
      .then(setQuestions)
      .finally(() => setIsLoading(false));
  }, []);

  const userTurns = Math.floor(messageCount / 2);

  return (
    <div className="min-h-dvh bg-stone-50 flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-stone-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-1">
            Conversation with {persona.name}
          </h2>
          <p className="text-stone-500 text-sm">
            {userTurns} exchange{userTurns !== 1 ? "s" : ""} on {topic}
          </p>
        </div>

        {/* Reflection questions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Things to sit with
          </h3>
          {isLoading ? (
            <div className="flex items-center gap-2 text-stone-400 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" />
              </span>
              Generating reflection...
            </div>
          ) : questions.length > 0 ? (
            <ol className="space-y-4">
              {questions.map((q, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-stone-300 font-mono text-sm mt-0.5 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-stone-700 text-sm leading-relaxed">{q}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-stone-400 text-sm">
              What's one thing {persona.name} said that surprised you?
            </p>
          )}
        </div>

        {/* Perspective shift check-in */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Quick check-in
          </h3>
          <p className="text-stone-700 text-sm mb-4">
            Did this conversation change how you think about {topic} at all?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["Not really", "A little", "Meaningfully"].map((option) => (
              <button
                key={option}
                onClick={() => setPerspectiveShift(option)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  perspectiveShift === option
                    ? "bg-stone-900 text-stone-50 border-stone-900"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {perspectiveShift && (
            <p className="text-xs text-stone-400 mt-3">
              Thanks for reflecting. That kind of honesty is what this is all about.
            </p>
          )}
        </div>

        {/* Start over */}
        <button
          onClick={onStartOver}
          className="w-full bg-stone-900 text-stone-50 py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-stone-700 transition-colors"
        >
          Try another conversation
        </button>
      </div>
    </div>
  );
}
