import { useState, useRef, useEffect } from "react";
import type { ChatMessage, Persona } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  messages: ChatMessage[];
  persona: Persona;
  isLoading: boolean;
  error: string | null;
  onSend: (message: string) => void;
}

export function ChatInterface({
  messages,
  persona,
  isLoading,
  error,
  onSend,
}: Props) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    onSend(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              personaName={persona.name}
            />
          ))}
          {isLoading && <TypingIndicator personaName={persona.name} />}
          {error && (
            <div className="text-center text-sm text-red-500 py-2 px-4 bg-red-50 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 pt-3 pb-4 pb-[env(safe-area-inset-bottom,1rem)]">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto flex gap-3 items-end"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none px-4 py-3 border border-stone-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cdi-purple disabled:opacity-50 max-h-36 overflow-y-auto"
            style={{ lineHeight: "1.5", fontSize: "16px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-cdi-purple text-white px-4 py-3 rounded-xl text-sm font-medium hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            Send
          </button>
        </form>
        <p className="hidden sm:block text-xs text-stone-300 text-center mt-2 max-w-2xl mx-auto">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
