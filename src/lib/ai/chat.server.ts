import { convertToModelMessages, type UIMessage } from "ai";
import { createResponsesCall } from "./responses.ts";
import { assistantInstructions } from "./assistant-prompt";
import { detectConversationLanguage, type AssistantLanguage } from "./language";

function extractUserText(message: UIMessage): string {
  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => (part.type === "text" && "text" in part ? String(part.text) : ""))
      .join(" ");
  }
  return "";
}

function resolveConversationLanguage(messages: UIMessage[], fallback: AssistantLanguage): AssistantLanguage {
  let lang: AssistantLanguage = fallback;
  for (const m of messages) {
    if (m.role !== "user") continue;
    const text = extractUserText(m);
    if (text.trim()) {
      lang = detectConversationLanguage(text, lang);
    }
  }
  return lang;
}

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "The assistant is not set up yet." }, { status: 500 });
  let body: { messages?: UIMessage[]; lang?: string };
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-30) : [];
  if (messages.length === 0) return Response.json({ error: "Please type a question." }, { status: 400 });
  const initialLang: AssistantLanguage = body.lang === "hi" ? "hi" : "en";
  const detectedLang = resolveConversationLanguage(messages, initialLang);
  const call = createResponsesCall(
    request,
    { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
    await convertToModelMessages(messages),
    assistantInstructions(detectedLang),
  );
  return call.response();
}
