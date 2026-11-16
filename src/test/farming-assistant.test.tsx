import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import { AssistantPanel, FarmingAssistant } from "@/components/site/FarmingAssistant";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { VOICE_PREFERENCE_STORAGE_KEY } from "@/lib/ai/speech";

function createUIMessageStreamResponse(text: string): Response {
  const encoder = new TextEncoder();
  const msgId = `msg-${Math.random().toString(36).slice(2, 8)}`;
  const textId = `txt-${Math.random().toString(36).slice(2, 8)}`;
  const events = [
    { type: "start", messageId: msgId },
    { type: "text-start", id: textId },
    { type: "text-delta", id: textId, delta: text },
    { type: "text-end", id: textId },
    { type: "finish", finishReason: "stop" },
  ];
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const evt of events) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "x-vercel-ai-ui-message-stream": "v1",
    },
  });
}

class MockUtterance {
  text: string;
  lang = "en-US";
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function createMockSpeechSynthesis(voices: SpeechSynthesisVoice[]) {
  const spoken: MockUtterance[] = [];
  const synth = {
    getVoices: vi.fn(() => voices),
    speak: vi.fn((utterance: MockUtterance) => {
      spoken.push(utterance);
      utterance.onstart?.();
    }),
    pause: vi.fn(() => {
      spoken.at(-1)?.onpause?.();
    }),
    resume: vi.fn(() => {
      spoken.at(-1)?.onresume?.();
    }),
    cancel: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    spoken,
  };
  return synth;
}

const sampleVoices: SpeechSynthesisVoice[] = [
  { name: "Google English (India)", lang: "en-IN", localService: false, default: false, voiceURI: "en-in" },
  { name: "Google US English", lang: "en-US", localService: false, default: true, voiceURI: "en-us" },
  { name: "Google हिन्दी", lang: "hi-IN", localService: false, default: false, voiceURI: "hi-in" },
];

function LanguageObserver() {
  const { lang } = useLanguage();
  return <span data-testid="site-lang">{lang}</span>;
}

describe("FarmingAssistant bilingual text & voice integration", () => {
  const originalFetch = globalThis.fetch;
  const originalSpeechSynthesis = window.speechSynthesis;
  const originalUtterance = window.SpeechSynthesisUtterance;
  const w = window as unknown as {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  };
  const originalSR = w.SpeechRecognition;
  const originalWebkitSR = w.webkitSpeechRecognition;

  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
    globalThis.fetch = originalFetch;
    Object.defineProperty(window, "speechSynthesis", { value: originalSpeechSynthesis, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: originalUtterance, configurable: true });
    w.SpeechRecognition = originalSR;
    w.webkitSpeechRecognition = originalWebkitSR;
    vi.restoreAllMocks();
  });

  it("handles Hindi, English, and Hinglish questions with automatic language detection without changing site language", async () => {
    const fetchBodies: Array<{ lang?: string; messages?: unknown[] }> = [];
    globalThis.fetch = vi.fn(async (_input, init) => {
      const parsed = JSON.parse(String(init?.body ?? "{}")) as {
        lang?: string;
        messages?: Array<{ parts?: Array<{ type: string; text?: string }> }>;
      };
      fetchBodies.push(parsed);
      const lastText = parsed.messages?.at(-1)?.parts?.[0]?.text ?? "";
      if (parsed.lang === "hi") {
        return createUIMessageStreamResponse(`मिट्टी की जांच कराएं: ${lastText}`);
      }
      return createUIMessageStreamResponse(`Soil testing is recommended: ${lastText}`);
    }) as typeof fetch;

    render(
      <LanguageProvider>
        <LanguageObserver />
        <PromptInputProvider>
          <AssistantPanel onClose={() => {}} />
        </PromptInputProvider>
      </LanguageProvider>,
    );

    const textarea = screen.getByRole("textbox");
    const sendBtn = () => screen.getByRole("button", { name: /submit|भेजें/i });

    // 1. Hindi (Devanagari) question -> Hindi response
    fireEvent.change(textarea, { target: { value: "मिट्टी की उर्वरता कैसे बढ़ाएं?" } });
    fireEvent.click(sendBtn());

    await waitFor(() => {
      expect(screen.getByText(/मिट्टी की जांच कराएं:/)).toBeInTheDocument();
    });
    expect(fetchBodies[0]?.lang).toBe("hi");
    // Site-wide language remains independent ("en")
    expect(screen.getByTestId("site-lang")).toHaveTextContent("en");

    // 2. English question -> English response
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "How do I control pests?" } });
    fireEvent.click(sendBtn());

    await waitFor(() => {
      expect(screen.getByText(/Soil testing is recommended/)).toBeInTheDocument();
    });
    expect(fetchBodies[1]?.lang).toBe("en");
    expect(screen.getByTestId("site-lang")).toHaveTextContent("en");

    // 3. Hinglish mixed question -> detected as Hindi ("hi")
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Meri fasal ke patte peele ho rahe hain" } });
    fireEvent.click(sendBtn());

    await waitFor(() => {
      expect(fetchBodies[2]?.lang).toBe("hi");
    });
  });

  it("supports Listen, Pause, Resume, Stop, Replay, and automatic voice selection for Hindi and English", async () => {
    const synth = createMockSpeechSynthesis(sampleVoices);
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: MockUtterance, configurable: true });

    globalThis.fetch = vi.fn(async (_input, init) => {
      const parsed = JSON.parse(String(init?.body ?? "{}")) as { lang?: string };
      return createUIMessageStreamResponse(
        parsed.lang === "hi"
          ? "कृपया अपने नज़दीकी कृषि विज्ञान केंद्र से सलाह लें।"
          : "Please consult your local agricultural officer.",
      );
    }) as typeof fetch;

    render(
      <LanguageProvider>
        <PromptInputProvider>
          <AssistantPanel onClose={() => {}} />
        </PromptInputProvider>
      </LanguageProvider>,
    );

    // Send English message
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Which fertilizer should I use?" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Please consult your local agricultural officer.")).toBeInTheDocument();
    });

    // Click Listen -> speaks with en-IN voice
    const listenButtons = screen.getAllByRole("button", { name: /listen/i });
    fireEvent.click(listenButtons[0]!);

    expect(synth.speak).toHaveBeenCalledTimes(1);
    expect(synth.spoken[0]?.lang).toBe("en-IN");
    expect(synth.spoken[0]?.voice?.lang).toBe("en-IN");
    expect(screen.getByText(/Speaking…/)).toBeInTheDocument();

    // Pause -> Resume -> Stop -> Replay
    fireEvent.click(screen.getByRole("button", { name: /pause/i }));
    expect(synth.pause).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Paused/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /resume/i }));
    expect(synth.resume).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Speaking…/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^stop$/i }));
    expect(synth.cancel).toHaveBeenCalled();

    // Replay button appears after message was played
    fireEvent.click(screen.getByRole("button", { name: /replay/i }));
    expect(synth.speak).toHaveBeenCalledTimes(2);

    // Complete utterance naturally
    act(() => {
      synth.spoken[1]?.onend?.();
    });

    // Send Hindi message and click Listen -> speaks with hi-IN voice
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "फसल के पत्ते पीले क्यों हो रहे हैं?" } });
    fireEvent.click(screen.getByRole("button", { name: /submit|भेजें/i }));

    await waitFor(() => {
      expect(screen.getByText("कृपया अपने नज़दीकी कृषि विज्ञान केंद्र से सलाह लें।")).toBeInTheDocument();
    });

    const hindiListen = screen.getByRole("button", { name: /^सुनें$/i });
    fireEvent.click(hindiListen);
    expect(synth.spoken.at(-1)?.lang).toBe("hi-IN");
    expect(synth.spoken.at(-1)?.voice?.lang).toBe("hi-IN");
  });

  it("supports automatic voice mode and persists voice preference across refresh/remount", async () => {
    const synth = createMockSpeechSynthesis(sampleVoices);
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { value: MockUtterance, configurable: true });

    globalThis.fetch = vi.fn(async () =>
      createUIMessageStreamResponse("Soil testing helps optimize fertilizer use."),
    ) as typeof fetch;

    const { unmount } = render(
      <LanguageProvider>
        <FarmingAssistant />
      </LanguageProvider>,
    );

    // Open assistant
    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));

    // Default is Text only
    const textOnlyRadio = screen.getByRole("radio", { name: /text only/i });
    const autoRadio = screen.getByRole("radio", { name: /text \+ auto voice/i });
    expect(textOnlyRadio).toHaveAttribute("aria-checked", "true");

    // Select automatic voice mode
    fireEvent.click(autoRadio);
    expect(autoRadio).toHaveAttribute("aria-checked", "true");
    expect(window.localStorage.getItem(VOICE_PREFERENCE_STORAGE_KEY)).toBe("auto");

    // Simulate page refresh by unmounting and remounting
    unmount();
    render(
      <LanguageProvider>
        <FarmingAssistant />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /ask ai/i }));

    const restoredAutoRadio = screen.getByRole("radio", { name: /text \+ auto voice/i });
    expect(restoredAutoRadio).toHaveAttribute("aria-checked", "true");

    // Ask question in auto mode -> automatically speaks response when complete
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "How can I improve soil fertility?" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Soil testing helps optimize fertilizer use.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(synth.speak).toHaveBeenCalledTimes(1);
    });
  });

  it("supports editable voice input via SpeechRecognition and graceful fallbacks when mic/TTS are unavailable", async () => {
    const mockRec = {
      lang: "",
      interimResults: false,
      continuous: false,
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null as ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null,
      onerror: null as ((e: { error: string }) => void) | null,
      onend: null as (() => void) | null,
    };
    w.SpeechRecognition = function MockSpeechRecognition() {
      return mockRec;
    };

    // Remove speechSynthesis to test graceful TTS fallback
    Object.defineProperty(window, "speechSynthesis", { value: undefined, configurable: true });

    globalThis.fetch = vi.fn(async () =>
      createUIMessageStreamResponse("Add compost and test your soil."),
    ) as typeof fetch;

    render(
      <LanguageProvider>
        <PromptInputProvider>
          <AssistantPanel onClose={() => {}} />
        </PromptInputProvider>
      </LanguageProvider>,
    );

    // Start microphone recognition
    fireEvent.click(screen.getByRole("button", { name: /speak your question/i }));
    expect(mockRec.start).toHaveBeenCalledTimes(1);
    expect(mockRec.lang).toBe("en-IN");
    expect(screen.getByText(/Listening \(English\)/)).toBeInTheDocument();

    // Simulate recognized speech appearing in input before sending
    act(() => {
      mockRec.onresult?.({
        results: [Object.assign([{ transcript: "meri mitti kaise sudhare" }], { isFinal: true })],
      });
      mockRec.onend?.();
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe("meri mitti kaise sudhare");

    // Farmer can edit recognized text before sending
    fireEvent.change(textarea, { target: { value: "meri mitti kaise sudhare bhai" } });
    expect(textarea.value).toBe("meri mitti kaise sudhare bhai");

    // Simulate mic permission denied error
    fireEvent.click(screen.getByRole("button", { name: /speak your question|बोलकर पूछें/i }));
    act(() => {
      mockRec.onerror?.({ error: "not-allowed" });
    });
    expect(screen.getByRole("status")).toHaveTextContent(/permission|अनुमति/i);

    // Send edited text -> response renders -> Listen button shows graceful TTS unavailable fallback
    fireEvent.click(screen.getByRole("button", { name: /submit|भेजें/i }));
    await waitFor(() => {
      expect(screen.getByText("Add compost and test your soil.")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /listen|सुनें/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/not available|उपलब्ध नहीं/i);

    // Remove SpeechRecognition -> graceful unsupported browser message
    w.SpeechRecognition = undefined;
    w.webkitSpeechRecognition = undefined;
    fireEvent.click(screen.getByRole("button", { name: /speak your question|बोलकर पूछें/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/not supported|उपलब्ध नहीं/i);
  });
});
