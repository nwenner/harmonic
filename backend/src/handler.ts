import Anthropic from "@anthropic-ai/sdk";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

// Fetch the API key from SSM once per cold start and cache it.
const ssm = new SSMClient({});
let anthropic: Anthropic;

async function getAnthropicClient(): Promise<Anthropic> {
  if (anthropic) return anthropic;
  const result = await ssm.send(
    new GetParameterCommand({
      Name: process.env.SSM_API_KEY_NAME!,
      WithDecryption: true,
    })
  );
  anthropic = new Anthropic({ apiKey: result.Parameter!.Value! });
  return anthropic;
}

const JSON_HEADER = { "Content-Type": "application/json" };

interface PersonaRequest {
  type: "generate_persona";
  topic: string;
  userStance?: string;
}

interface ChatRequest {
  type: "chat";
  persona: Persona;
  messages: ChatMessage[];
  topic: string;
  userStance?: string;
}

interface Persona {
  name: string;
  age: number;
  occupation: string;
  location: string;
  oneLineSummary: string;
  coreBeliefs: string[];
  stance: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ok(body: unknown): APIGatewayProxyResultV2 {
  return { statusCode: 200, headers: JSON_HEADER, body: JSON.stringify(body) };
}

function err(status: number, message: string): APIGatewayProxyResultV2 {
  return {
    statusCode: status,
    headers: JSON_HEADER,
    body: JSON.stringify({ error: message }),
  };
}

async function generatePersona(
  topic: string,
  userStance?: string
): Promise<Persona> {
  const stanceContext = userStance
    ? `The user believes: "${userStance}". Generate someone who genuinely holds a different view.`
    : `Generate someone with a thoughtful, well-grounded perspective on this topic.`;

  const prompt = `You are helping build a constructive dialogue practice tool. Generate a realistic conversation partner for the topic: "${topic}".

${stanceContext}

This person should:
- Hold their view because of genuine life experience, values, and community context — NOT just policy talking points
- Be thoughtful and intellectually honest, not a strawman
- Have specific, believable background details

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "name": "First Last",
  "age": 35,
  "occupation": "specific job title",
  "location": "City, State",
  "stance": "one sentence describing their position on the topic",
  "oneLineSummary": "one vivid sentence about who they are and why they hold their view",
  "coreBeliefs": ["belief rooted in values/experience", "another core belief", "a third belief"]
}

Make the person feel real. Avoid stereotypes. Give them texture.`;

  const client = await getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    temperature: 0.9,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned) as Persona;
}

async function chat(
  persona: Persona,
  messages: ChatMessage[],
  topic: string,
  userStance?: string
): Promise<string> {
  const systemPrompt = `You are ${persona.name}, ${persona.age} years old, working as a ${persona.occupation} in ${persona.location}.

Your position on "${topic}": ${persona.stance}

Why you hold this view (your core beliefs and experiences):
${persona.coreBeliefs.map((b, i) => `${i + 1}. ${b}`).join("\n")}

${userStance ? `The person you're talking with believes: "${userStance}"` : ""}

RULES FOR THIS CONVERSATION:
- You are having a genuine conversation, not a debate. You are not trying to win.
- Respond in 2-4 sentences. Be direct but human. Sound like a real person talking.
- Acknowledge when the other person makes a strong point — say so honestly.
- Ask a genuine question back roughly every other turn. Be curious about them.
- Do NOT recite statistics or cite sources unless specifically asked. Talk from personal experience and observation.
- Do NOT strawman the other person's view. Engage with what they actually said.
- If they make a point you genuinely can't counter, admit it — but explain why you still hold your overall view.
- You may soften or nuance your position slightly over a long conversation if genuinely persuaded on a specific point. But do not flip entirely — real people rarely change their minds in one conversation.
- Stay in character. You are ${persona.name} from ${persona.location}, not an AI assistant.
- Do not mention that you are an AI, a language model, or anything similar.`;

  const client = await getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    temperature: 0.8,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}

async function generateReflection(
  persona: Persona,
  messages: ChatMessage[],
  topic: string
): Promise<string[]> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "You" : persona.name}: ${m.content}`)
    .join("\n");

  const prompt = `You facilitated a dialogue practice session. The topic was "${topic}". Here's what was said:

${transcript}

Generate 3 brief, genuine reflection questions for the person who just practiced this conversation. These should help them notice something about their own thinking or how they engaged. Make them specific to what actually happened in this conversation — not generic. Keep each question to one sentence.

Return ONLY a JSON array of 3 strings, no markdown:
["question 1", "question 2", "question 3"]`;

  const client = await getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "[]";
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned) as string[];
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  _context: Context
): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http.method !== "POST") {
    return err(405, "Method not allowed");
  }

  let body: PersonaRequest | ChatRequest | { type: "reflection"; persona: Persona; messages: ChatMessage[]; topic: string };
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return err(400, "Invalid JSON");
  }

  try {
    if (body.type === "generate_persona") {
      const req = body as PersonaRequest;
      if (!req.topic) return err(400, "topic is required");
      const persona = await generatePersona(req.topic, req.userStance);
      return ok({ persona });
    }

    if (body.type === "chat") {
      const req = body as ChatRequest;
      if (!req.persona || !req.messages?.length) {
        return err(400, "persona and messages are required");
      }
      const reply = await chat(req.persona, req.messages, req.topic, req.userStance);
      return ok({ reply });
    }

    if (body.type === "reflection") {
      const req = body as { type: "reflection"; persona: Persona; messages: ChatMessage[]; topic: string };
      const questions = await generateReflection(req.persona, req.messages, req.topic);
      return ok({ questions });
    }

    return err(400, "Unknown request type");
  } catch (e) {
    console.error("Handler error:", e);
    return err(500, "Internal server error");
  }
};
