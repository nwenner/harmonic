import { useState, useCallback } from "react";
import type { Persona, ChatMessage } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "";

function uid() {
  return Math.random().toString(36).slice(2);
}

export function useConversation() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [topic, setTopic] = useState("");
  const [userStance, setUserStance] = useState("");
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startConversation = useCallback(
    async (selectedTopic: string, stance: string): Promise<boolean> => {
      setTopic(selectedTopic);
      setUserStance(stance);
      setIsLoadingPersona(true);
      setError(null);
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "generate_persona",
            topic: selectedTopic,
            userStance: stance || undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed to generate persona");
        const data = await res.json();
        setPersona(data.persona);
        const opener: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: `Hi, I'm ${data.persona.name}. I heard we were going to talk about ${selectedTopic}. I'll be honest — I feel pretty strongly about this. What's on your mind?`,
          timestamp: new Date(),
        };
        setMessages([opener]);
        return true;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Try again."
        );
        return false;
      } finally {
        setIsLoadingPersona(false);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!persona) return;
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoadingReply(true);
      setError(null);
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "chat",
            persona,
            topic,
            userStance: userStance || undefined,
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        if (!res.ok) throw new Error("Failed to get reply");
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Try again."
        );
      } finally {
        setIsLoadingReply(false);
      }
    },
    [persona, messages, topic, userStance]
  );

  const endConversation = useCallback(async () => {
    if (!persona || messages.length < 2) return [];
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reflection",
          persona,
          topic,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate reflection");
      const data = await res.json();
      setReflectionQuestions(data.questions || []);
      return data.questions as string[];
    } catch {
      return [];
    }
  }, [persona, messages, topic]);

  const reset = useCallback(() => {
    setPersona(null);
    setMessages([]);
    setTopic("");
    setUserStance("");
    setReflectionQuestions([]);
    setError(null);
  }, []);

  return {
    persona,
    messages,
    topic,
    userStance,
    isLoadingPersona,
    isLoadingReply,
    reflectionQuestions,
    error,
    startConversation,
    sendMessage,
    endConversation,
    reset,
  };
}
