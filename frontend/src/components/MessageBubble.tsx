import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
  personaName: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, personaName }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && (
          <span className="text-xs text-stone-400 dark:text-stone-500 mb-1 ml-1">{personaName}</span>
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-cdi-purple text-white rounded-tr-sm"
              : "bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 text-stone-800 dark:text-stone-100 rounded-tl-sm shadow-sm"
          }`}
        >
          {message.content}
        </div>
        <span className="text-xs text-stone-300 dark:text-stone-600 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
