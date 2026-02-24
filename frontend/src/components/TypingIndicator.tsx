interface Props {
  personaName: string;
}

export function TypingIndicator({ personaName }: Props) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[75%] flex flex-col items-start">
        <span className="text-xs text-stone-400 dark:text-stone-500 mb-1 ml-1">{personaName}</span>
        <div className="bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
          <span className="w-2 h-2 bg-stone-300 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-stone-300 dark:bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-stone-300 dark:bg-slate-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
