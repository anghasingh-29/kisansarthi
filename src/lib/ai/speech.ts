import { detectTextLanguage, type AssistantLanguage } from "./language";

export type VoicePreferenceMode = "text" | "auto" | "on-demand";

export const VOICE_PREFERENCE_STORAGE_KEY = "kisansarthi_assistant_voice_mode";

export function readStoredVoicePreference(): VoicePreferenceMode {
  if (typeof window === "undefined") return "text";
  try {
    const raw = window.localStorage.getItem(VOICE_PREFERENCE_STORAGE_KEY);
    if (raw === "text" || raw === "auto" || raw === "on-demand") {
      return raw;
    }
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
  return "text";
}

export function writeStoredVoicePreference(mode: VoicePreferenceMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOICE_PREFERENCE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors in restricted browser contexts
  }
}

export function cleanTextForSpeech(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/[>|]/g, " ")
    .replace(/\s+([.,!?।])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits long speech text into natural sentence chunks so browser SpeechSynthesis
 * reads complete answers reliably without hitting browser utterance length timeouts.
 */
export function splitSpeechChunks(text: string, maxChunkLength = 220): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  const sentences = cleaned
    .split(/(?<=[.!?।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > maxChunkLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      const words = sentence.split(/\s+/);
      let part = "";
      for (const word of words) {
        if ((part ? `${part} ${word}` : word).length > maxChunkLength) {
          if (part) chunks.push(part);
          part = word;
        } else {
          part = part ? `${part} ${word}` : word;
        }
      }
      if (part) chunks.push(part);
      continue;
    }

    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChunkLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export interface VoiceSelectionResult {
  voice: SpeechSynthesisVoice | undefined;
  langTag: "hi-IN" | "en-IN" | string;
  matchedLanguage: AssistantLanguage;
  hasMatchingVoice: boolean;
}

function scoreVoice(voice: SpeechSynthesisVoice, lang: AssistantLanguage): number {
  const vLang = voice.lang.toLowerCase();
  const vName = voice.name.toLowerCase();
  let score = 0;

  if (lang === "hi") {
    if (vLang === "hi-in") score += 100;
    else if (vLang.startsWith("hi")) score += 80;
    else return -1;
  } else {
    if (vLang === "en-in") score += 100;
    else if (vLang === "en-gb" || vLang === "en-us") score += 80;
    else if (vLang.startsWith("en")) score += 60;
    else return -1;
  }

  // Prefer natural/neural/high-quality voices when available
  if (vName.includes("natural") || vName.includes("neural")) score += 30;
  if (vName.includes("google")) score += 25;
  if (vName.includes("microsoft")) score += 20;
  if (
    vName.includes("swara") ||
    vName.includes("madhur") ||
    vName.includes("lekha") ||
    vName.includes("neerja") ||
    vName.includes("prabhat") ||
    vName.includes("veena") ||
    vName.includes("rishi")
  ) {
    score += 20;
  }
  if (!voice.localService) score += 5;
  if (voice.default) score += 2;

  return score;
}

/**
 * Selects an appropriate voice for the detected language without ever reading
 * Hindi text with an English voice or English text with a Hindi voice.
 */
export function selectSpeechVoice(
  voices: SpeechSynthesisVoice[],
  text: string,
  fallbackLang: AssistantLanguage = "en",
): VoiceSelectionResult {
  const matchedLanguage = detectTextLanguage(text, fallbackLang);
  const preferredLangTag = matchedLanguage === "hi" ? "hi-IN" : "en-IN";

  let bestVoice: SpeechSynthesisVoice | undefined;
  let bestScore = -1;

  for (const voice of voices) {
    const s = scoreVoice(voice, matchedLanguage);
    if (s > bestScore) {
      bestScore = s;
      bestVoice = voice;
    }
  }

  return {
    voice: bestVoice,
    langTag: bestVoice?.lang || preferredLangTag,
    matchedLanguage,
    hasMatchingVoice: Boolean(bestVoice),
  };
}
