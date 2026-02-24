import type { Persona } from "../types";

interface Props {
  persona: Persona;
  topic: string;
  onEnd: () => void;
}

const AVATAR_COLORS = [
  "bg-amber-500",
  "bg-teal-600",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-orange-500",
];

function avatarColor(name: string) {
  const i =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

export function PersonaCard({ persona, topic, onEnd }: Props) {
  const initial = persona.name.charAt(0).toUpperCase();
  const color = avatarColor(persona.name);

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-stone-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`${color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0`}
          >
            {initial}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                {persona.name}
              </span>
              <span className="text-stone-400 dark:text-stone-500 text-xs truncate">
                {persona.age} · {persona.occupation} · {persona.location}
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 text-xs mt-0.5 leading-relaxed line-clamp-2">
              {persona.oneLineSummary}
            </p>
            <div className="mt-1">
              <span className="inline-block text-xs bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300 px-2 py-0.5 rounded-full truncate max-w-full">
                Topic: {topic}
              </span>
            </div>
          </div>

          {/* End button */}
          <button
            onClick={onEnd}
            className="flex-shrink-0 text-xs text-stone-400 dark:text-slate-400 hover:text-stone-600 dark:hover:text-slate-200 border border-stone-200 dark:border-slate-600 hover:border-stone-400 dark:hover:border-slate-400 px-3 py-1.5 rounded-md transition-colors"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}
