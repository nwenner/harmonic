import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useConversation } from "./hooks/useConversation";
import { useTheme } from "./hooks/useTheme";
import { TopicSelector } from "./components/TopicSelector";
import { PersonaCard } from "./components/PersonaCard";
import { ChatInterface } from "./components/ChatInterface";
import { ConversationEnd } from "./components/ConversationEnd";
import { ThemeToggle } from "./components/ThemeToggle";
import { About } from "./components/About";
import type { AppState } from "./types";

function Main() {
  const [appState, setAppState] = useState<AppState>("select");
  const { dark, toggle } = useTheme();
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
      <>
        <ThemeToggle dark={dark} onToggle={toggle} />
        <TopicSelector onStart={handleStart} isLoading={isLoadingPersona} />
      </>
    );
  }

  if (appState === "end" && persona) {
    return (
      <>
        <ThemeToggle dark={dark} onToggle={toggle} />
        <ConversationEnd
          persona={persona}
          topic={topic}
          messageCount={messages.length}
          onGetReflections={endConversation}
          onStartOver={handleStartOver}
        />
      </>
    );
  }

  if (appState === "chat" && persona) {
    return (
      <div className="h-dvh flex flex-col dark:bg-slate-900">
        <ThemeToggle dark={dark} onToggle={toggle} />
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

  return (
    <div className="min-h-screen flex items-center justify-center">
      <ThemeToggle dark={dark} onToggle={toggle} />
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
