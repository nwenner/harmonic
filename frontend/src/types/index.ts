export interface Persona {
  name: string;
  age: number;
  occupation: string;
  location: string;
  stance: string;
  oneLineSummary: string;
  coreBeliefs: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type AppState = "select" | "chat" | "end";

export const CURATED_TOPICS = [
  "Gun control",
  "Climate policy",
  "Immigration",
  "Student loan forgiveness",
  "Social media regulation",
  "Universal basic income",
  "Criminal justice reform",
  "Work from home",
] as const;
