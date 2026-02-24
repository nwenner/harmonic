import { useState } from "react";
import { useConversation } from "./hooks/useConversation";
import { TopicSelector } from "./components/TopicSelector";
import { PersonaCard } from "./components/PersonaCard";
import { ChatInterface } from "./components/ChatInterface";
import { ConversationEnd } from "./components/ConversationEnd";
import type { AppState } from "./types";

function App() {
  const [appState, setAppState] = useState<AppState>("select");
  const {
    persona,
    messages,
    topic,
    isLoadingPersona,
    isLoadingReply,
    error,
    startConversation,
    sendMessage,
    endConversation,
    reset,
  } = useConversation();

  async function handleStart(selectedTopic: string, stance: string) {
    const ok = await startConversation(selectedTopic, stance);
    if (ok) setAppState("chat");
  }

  async function handleEnd() {
    setAppState("end");
  }

  function handleStartOver() {
    reset();
    setAppState("select");
  }

  if (appState === "select") {
    return (
      <TopicSelector onStart={handleStart} isLoading={isLoadingPersona} />
    );
  }

  if (appState === "end" && persona) {
    return (
      <ConversationEnd
        persona={persona}
        topic={topic}
        messageCount={messages.length}
        onGetReflections={endConversation}
        onStartOver={handleStartOver}
      />
    );
  }

  if (appState === "chat" && persona) {
    return (
      <div className="h-dvh flex flex-col">
        <PersonaCard persona={persona} topic={topic} onEnd={handleEnd} />
        <ChatInterface
          messages={messages}
          persona={persona}
          isLoading={isLoadingReply}
          error={error}
          onSend={sendMessage}
        />
      </div>
    );
  }

  // Fallback loading state (persona generating but state already moved to chat)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex gap-2 mb-4">
          <span className="w-3 h-3 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-3 h-3 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-3 h-3 bg-stone-400 rounded-full animate-bounce" />
        </div>
        <p className="text-stone-500 text-sm">
          Finding your conversation partner...
        </p>
      </div>
    </div>
  );
}

export default App;
