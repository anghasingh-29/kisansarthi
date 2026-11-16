import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { detectConversationLanguage } from "@/lib/ai/language";
import {
  cleanTextForSpeech,
  readStoredVoicePreference,
  selectSpeechVoice,
  splitSpeechChunks,
  VOICE_PREFERENCE_STORAGE_KEY,
  writeStoredVoicePreference,
} from "@/lib/ai/speech";
import { handleChat } from "@/lib/ai/chat.server";

function mockVoice(name: string, lang: string, options?: { localService?: boolean; default?: boolean }): SpeechSynthesisVoice {
  return {
    name,
    lang,
    localService: options?.localService ?? false,
    default: options?.default ?? false,
    voiceURI: name,
  };
}

describe("Automatic language detection (Hindi, English, Hinglish)", () => {
  it("detects Devanagari Hindi questions as Hindi", () => {
    expect(detectConversationLanguage("मेरी फसल के पत्ते पीले क्यों हो रहे हैं?", "en")).toBe("hi");
    expect(detectConversationLanguage("गेहूँ में कौन सा खाद डालना चाहिए?", "en")).toBe("hi");
  });

  it("detects English questions as English", () => {
    expect(detectConversationLanguage("Why are my crop leaves turning yellow?", "hi")).toBe("en");
    expect(detectConversationLanguage("How can I improve soil fertility?", "hi")).toBe("en");
    expect(detectConversationLanguage("Tell me about PM Kisan Yojana", "hi")).toBe("en");
  });

  it("detects Romanized Hindi / Hinglish mixed questions as Hindi", () => {
    expect(detectConversationLanguage("Meri fasal ke patte peele ho rahe hain", "en")).toBe("hi");
    expect(detectConversationLanguage("Gehu me kaun sa khad dalna chahiye?", "en")).toBe("hi");
    expect(detectConversationLanguage("Mitti ki urvarata kaise badhayein?", "en")).toBe("hi");
  });

  it("maintains the ongoing conversation language for ambiguous or short follow-ups", () => {
    expect(detectConversationLanguage("OK", "hi")).toBe("hi");
    expect(detectConversationLanguage("NPK 19:19:19", "hi")).toBe("hi");
    expect(detectConversationLanguage("OK", "en")).toBe("en");
  });
});

describe("Automatic voice selection (Hindi hi-IN and English en-IN/en-*)", () => {
  const mixedVoices = [
    mockVoice("Google US English", "en-US"),
    mockVoice("Google English (India)", "en-IN"),
    mockVoice("Microsoft Swara Online (Natural) - Hindi (India)", "hi-IN"),
    mockVoice("Google हिन्दी", "hi-IN"),
  ];

  it("selects a natural Hindi voice (hi-IN) for Hindi text", () => {
    const result = selectSpeechVoice(mixedVoices, "मिट्टी की जांच कराएं और गोबर की खाद डालें।", "en");
    expect(result.matchedLanguage).toBe("hi");
    expect(result.hasMatchingVoice).toBe(true);
    expect(result.voice?.lang).toBe("hi-IN");
    expect(result.voice?.name).toContain("Swara");
  });

  it("prefers en-IN English voice over en-US for English text", () => {
    const result = selectSpeechVoice(mixedVoices, "Please test your soil before applying fertilizer.", "hi");
    expect(result.matchedLanguage).toBe("en");
    expect(result.hasMatchingVoice).toBe(true);
    expect(result.voice?.lang).toBe("en-IN");
  });

  it("falls back to other English voices when en-IN is unavailable", () => {
    const voices = [mockVoice("Google हिन्दी", "hi-IN"), mockVoice("Google US English", "en-US")];
    const result = selectSpeechVoice(voices, "How do I control pests safely?", "en");
    expect(result.hasMatchingVoice).toBe(true);
    expect(result.voice?.lang).toBe("en-US");
  });

  it("never assigns an English voice to Hindi text when no Hindi voice exists", () => {
    const englishOnly = [mockVoice("Google English (India)", "en-IN"), mockVoice("Google US English", "en-US")];
    const result = selectSpeechVoice(englishOnly, "फसल की सिंचाई कब करें?", "hi");
    expect(result.matchedLanguage).toBe("hi");
    expect(result.hasMatchingVoice).toBe(false);
    expect(result.voice).toBeUndefined();
    expect(result.langTag).toBe("hi-IN");
  });

  it("never assigns a Hindi voice to English text when no English voice exists", () => {
    const hindiOnly = [mockVoice("Google हिन्दी", "hi-IN")];
    const result = selectSpeechVoice(hindiOnly, "Which seeds should I plant?", "en");
    expect(result.matchedLanguage).toBe("en");
    expect(result.hasMatchingVoice).toBe(false);
    expect(result.voice).toBeUndefined();
    expect(result.langTag).toBe("en-IN");
  });
});

describe("Speech text normalization, chunking, and voice preference persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("cleans markdown formatting and splits long answers into complete readable chunks", () => {
    const md = "## Soil Health\n- Add **compost** regularly.\n- Test soil at your nearest *KVK*. `NPK` balance matters.";
    expect(cleanTextForSpeech(md)).toBe(
      "Soil Health Add compost regularly. Test soil at your nearest KVK. NPK balance matters.",
    );

    const longAnswer = Array.from({ length: 6 }, (_, i) => `Sentence number ${i + 1} gives helpful farming guidance.`).join(" ");
    const chunks = splitSpeechChunks(longAnswer, 120);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(" ")).toBe(longAnswer);
  });

  it("defaults to 'text' mode and persists voice preference in localStorage", () => {
    expect(readStoredVoicePreference()).toBe("text");
    writeStoredVoicePreference("auto");
    expect(window.localStorage.getItem(VOICE_PREFERENCE_STORAGE_KEY)).toBe("auto");
    expect(readStoredVoicePreference()).toBe("auto");
    writeStoredVoicePreference("on-demand");
    expect(readStoredVoicePreference()).toBe("on-demand");
  });
});

describe("Existing /api/chat server handler preservation", () => {
  const originalKey = process.env["LOVABLE_API_KEY"];

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env["LOVABLE_API_KEY"];
    } else {
      process.env["LOVABLE_API_KEY"] = originalKey;
    }
    vi.restoreAllMocks();
  });

  it("returns 500 when LOVABLE_API_KEY is not configured without crashing", async () => {
    delete process.env["LOVABLE_API_KEY"];
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "Hello" }] }] }),
    });
    const res = await handleChat(req);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "The assistant is not set up yet." });
  });
});
