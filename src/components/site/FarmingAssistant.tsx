import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { translations, useLanguage, type Language } from "@/lib/i18n";
import { detectConversationLanguage } from "@/lib/ai/language";
import {
  readStoredVoicePreference,
  selectSpeechVoice,
  splitSpeechChunks,
  writeStoredVoicePreference,
  type VoicePreferenceMode,
} from "@/lib/ai/speech";
import logo from "@/assets/kisan-assistant.png";

const textOf = (m: UIMessage) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

type SR = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type PlaybackState = "idle" | "loading" | "playing" | "paused";

export function FarmingAssistant() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary py-2 pl-2 pr-5 text-lg font-semibold text-primary-foreground shadow-card transition-transform hover:scale-105 motion-reduce:transition-none sm:bottom-6 sm:right-6"
          aria-label={t.assistant.askAiAriaLabel}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-background">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9" />
          </span>
          {t.assistant.askAiButton}
        </button>
      )}
      {open && (
        <PromptInputProvider>
          <AssistantPanel onClose={() => setOpen(false)} />
        </PromptInputProvider>
      )}
    </>
  );
}

export function AssistantPanel({ onClose }: { onClose: () => void }) {
  const { lang: siteLang } = useLanguage();
  const [chatLang, setChatLang] = useState<Language>(siteLang);
  const chatLangRef = useRef<Language>(chatLang);
  chatLangRef.current = chatLang;

  const [voiceMode, setVoiceMode] = useState<VoicePreferenceMode>("text");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState("");
  const [voiceMsg, setVoiceMsg] = useState("");
  const [listening, setListening] = useState(false);

  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [playedIds, setPlayedIds] = useState<Set<string>>(() => new Set());

  const recognition = useRef<SR | null>(null);
  const playbackRunRef = useRef(0);
  const lastAutoSpokenIdRef = useRef<string | null>(null);
  const pendingAutoSpeakRef = useRef(false);

  const controller = usePromptInputController();
  const dict = translations[chatLang];
  const t = dict.assistant;
  const tRef = useRef(t);
  tRef.current = t;

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ lang: chatLangRef.current }),
    }),
    onError: (e) => {
      pendingAutoSpeakRef.current = false;
      const msg = e.message || "";
      const cur = tRef.current;
      setError(/402/.test(msg) ? cur.error402 : /429/.test(msg) ? cur.error429 : cur.errorGeneric);
    },
  });
  const busy = status === "submitted" || status === "streaming";

  // Load persisted voice preference on mount (independent from website language)
  useEffect(() => {
    setVoiceMode(readStoredVoicePreference());
  }, []);

  // Load browser SpeechSynthesis voices and watch for async voice list updates
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !window.speechSynthesis) {
      return;
    }
    const synth = window.speechSynthesis;
    const syncVoices = () => {
      try {
        const available = synth.getVoices();
        if (Array.isArray(available)) {
          setVoices(available);
        }
      } catch {
        // Ignore browser voice enumeration errors
      }
    };
    syncVoices();
    synth.addEventListener?.("voiceschanged", syncVoices);
    return () => {
      synth.removeEventListener?.("voiceschanged", syncVoices);
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    playbackRunRef.current += 1;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
    setSpeakingId(null);
    setPlaybackState("idle");
  }, []);

  const speakMessage = useCallback(
    (m: UIMessage) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setVoiceMsg(tRef.current.noVoice);
        return;
      }
      const rawText = textOf(m);
      const chunks = splitSpeechChunks(rawText);
      if (chunks.length === 0) return;

      const synth = window.speechSynthesis;
      playbackRunRef.current += 1;
      const runId = playbackRunRef.current;

      try {
        synth.cancel();
      } catch {
        // Ignore cancel errors
      }

      const availableVoices = voices.length > 0 ? voices : synth.getVoices?.() ?? [];
      const selection = selectSpeechVoice(availableVoices, rawText, chatLangRef.current);

      if (availableVoices.length > 0 && !selection.hasMatchingVoice) {
        setVoiceMsg(
          selection.matchedLanguage === "hi"
            ? tRef.current.noHindiVoiceFallback
            : tRef.current.noEnglishVoiceFallback,
        );
      } else {
        setVoiceMsg("");
      }

      setSpeakingId(m.id);
      setPlaybackState("loading");
      setPlayedIds((prev) => {
        if (prev.has(m.id)) return prev;
        const next = new Set(prev);
        next.add(m.id);
        return next;
      });

      let chunkIndex = 0;

      const speakNextChunk = () => {
        if (playbackRunRef.current !== runId) return;
        const chunk = chunks[chunkIndex];
        if (!chunk) {
          setSpeakingId(null);
          setPlaybackState("idle");
          return;
        }

        const UtteranceCtor = window.SpeechSynthesisUtterance;
        if (!UtteranceCtor) {
          setVoiceMsg(tRef.current.noVoice);
          setSpeakingId(null);
          setPlaybackState("idle");
          return;
        }

        const utterance = new UtteranceCtor(chunk);
        utterance.lang = selection.langTag;
        if (selection.voice) {
          utterance.voice = selection.voice;
        }
        utterance.rate = 0.98;

        utterance.onstart = () => {
          if (playbackRunRef.current !== runId) return;
          setPlaybackState("playing");
        };

        utterance.onpause = () => {
          if (playbackRunRef.current !== runId) return;
          setPlaybackState("paused");
        };

        utterance.onresume = () => {
          if (playbackRunRef.current !== runId) return;
          setPlaybackState("playing");
        };

        utterance.onend = () => {
          if (playbackRunRef.current !== runId) return;
          chunkIndex += 1;
          if (chunkIndex < chunks.length) {
            speakNextChunk();
          } else {
            setSpeakingId(null);
            setPlaybackState("idle");
          }
        };

        utterance.onerror = () => {
          if (playbackRunRef.current !== runId) return;
          setVoiceMsg(tRef.current.noVoice);
          setSpeakingId(null);
          setPlaybackState("idle");
        };

        try {
          synth.speak(utterance);
        } catch {
          setVoiceMsg(tRef.current.noVoice);
          setSpeakingId(null);
          setPlaybackState("idle");
        }
      };

      speakNextChunk();
    },
    [voices],
  );

  const pauseSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.pause();
      setPlaybackState("paused");
    } catch {
      setVoiceMsg(tRef.current.noVoice);
    }
  }, []);

  const resumeSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.resume();
      setPlaybackState("playing");
    } catch {
      setVoiceMsg(tRef.current.noVoice);
    }
  }, []);

  // Automatically speak new assistant responses when voiceMode === "auto"
  useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      pendingAutoSpeakRef.current = true;
      return;
    }

    if (status !== "ready" || !pendingAutoSpeakRef.current) return;

    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") return;
    if (!textOf(lastMessage).trim()) return;

    pendingAutoSpeakRef.current = false;
    if (voiceMode !== "auto") return;
    if (lastAutoSpokenIdRef.current === lastMessage.id) return;

    lastAutoSpokenIdRef.current = lastMessage.id;
    speakMessage(lastMessage);
  }, [messages, status, voiceMode, speakMessage]);

  useEffect(
    () => () => {
      recognition.current?.stop();
      stopSpeaking();
    },
    [stopSpeaking],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleVoiceModeChange(nextMode: VoicePreferenceMode) {
    setVoiceMode(nextMode);
    writeStoredVoicePreference(nextMode);
    if (nextMode === "text") {
      stopSpeaking();
    }
  }

  function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setError("");
    stopSpeaking();

    const detected = detectConversationLanguage(q, chatLangRef.current);
    if (detected !== chatLangRef.current) {
      chatLangRef.current = detected;
      setChatLang(detected);
    }

    pendingAutoSpeakRef.current = true;
    void sendMessage({ text: q });
    controller.textInput.clear();
  }

  function toggleMic() {
    setVoiceMsg("");
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setVoiceMsg(t.noMic);
      return;
    }
    const rec = new Ctor();
    rec.lang = chatLangRef.current === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = true;
    rec.continuous = false;

    const prefix = controller.textInput.value.trim();
    rec.onresult = (e) => {
      const spoken = Array.from(e.results)
        .map((r) => r[0]?.transcript ?? "")
        .join("")
        .trim();
      const combined = prefix ? `${prefix} ${spoken}` : spoken;
      controller.textInput.setInput(combined);

      const detected = detectConversationLanguage(spoken, chatLangRef.current);
      if (detected !== chatLangRef.current) {
        chatLangRef.current = detected;
        setChatLang(detected);
      }
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setVoiceMsg(t.denied);
      } else if (e.error === "no-speech") {
        setVoiceMsg(t.noSpeech);
      } else if (e.error === "audio-capture") {
        setVoiceMsg(t.noMicHardware);
      } else if (e.error === "network") {
        setVoiceMsg(t.micNetworkError);
      } else {
        setVoiceMsg(t.noMic);
      }
    };
    rec.onend = () => setListening(false);
    recognition.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
      setVoiceMsg(t.noMic);
    }
  }

  const voiceOptions: { value: VoicePreferenceMode; label: string }[] = [
    { value: "text", label: t.voiceModeTextOnly },
    { value: "auto", label: t.voiceModeAuto },
    { value: "on-demand", label: t.voiceModeOnDemand },
  ];

  return (
    <section
      role="dialog"
      aria-label={t.title}
      className="fixed inset-x-2 bottom-2 top-16 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-card animate-in fade-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none sm:inset-x-auto sm:right-6 sm:top-auto sm:bottom-6 sm:h-[min(700px,calc(100vh-5rem))] sm:w-[430px]"
    >
      <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background">
          <img src={logo} alt="" width={34} height={34} className="h-8 w-8" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold leading-tight">{t.title}</p>
          <p className="text-xs opacity-90">{t.subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
          aria-label={t.clear}
          title={t.clear}
          disabled={messages.length === 0}
          onClick={() => {
            stop();
            stopSpeaking();
            pendingAutoSpeakRef.current = false;
            lastAutoSpokenIdRef.current = null;
            setPlayedIds(new Set());
            setMessages([]);
            setError("");
            setVoiceMsg("");
          }}
        >
          <Trash2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
          aria-label={t.closeAriaLabel}
          onClick={onClose}
        >
          <X />
        </Button>
      </header>

      <div className="space-y-2 border-b bg-secondary p-2">
        <div className="flex gap-2" role="radiogroup" aria-label="Assistant language / सहायक भाषा">
          {(["en", "hi"] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={chatLang === l}
              onClick={() => setChatLang(l)}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
                chatLang === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-primary hover:bg-background/70"
              }`}
            >
              {l === "en" ? dict.nav.englishOption : dict.nav.hindiOption}
            </button>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-1 rounded-lg bg-background/80 p-1"
          role="radiogroup"
          aria-label={t.voiceModeLabel}
        >
          <span className="flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
            {voiceMode === "text" ? (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            )}
            {t.voiceModeLabel}:
          </span>
          {voiceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={voiceMode === opt.value}
              onClick={() => handleVoiceModeChange(opt.value)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                voiceMode === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="gap-5 text-base">
          <Message from="assistant">
            <MessageContent>
              <p>{t.welcome}</p>
            </MessageContent>
          </Message>
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-xl border border-primary/30 bg-surface px-4 py-3 text-left text-sm font-medium text-primary hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m) => {
            const content = textOf(m);
            const isStreamingThis = busy && m.id === messages.at(-1)?.id;
            const isActiveAudio = speakingId === m.id && playbackState !== "idle";
            const wasPlayed = playedIds.has(m.id);

            return (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                      : ""
                  }
                >
                  {m.role === "assistant" ? (
                    <MessageResponse>{content}</MessageResponse>
                  ) : (
                    <p className="whitespace-pre-wrap">{content}</p>
                  )}
                </MessageContent>
                {m.role === "assistant" && content && !isStreamingThis && (
                  <div className="flex flex-wrap items-center gap-2">
                    {!isActiveAudio && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => speakMessage(m)}
                        aria-label={wasPlayed ? t.replay : t.listen}
                      >
                        {wasPlayed ? <RotateCcw className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        {wasPlayed ? t.replay : t.listen}
                      </Button>
                    )}

                    {isActiveAudio && playbackState === "loading" && (
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {t.loadingAudio}
                        </span>
                        <Button size="sm" variant="outline" onClick={stopSpeaking}>
                          <Square className="h-3.5 w-3.5" />
                          {t.stop}
                        </Button>
                      </>
                    )}

                    {isActiveAudio && playbackState === "playing" && (
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-primary">
                          <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                          {t.speaking}
                        </span>
                        <Button size="sm" variant="outline" onClick={pauseSpeaking}>
                          <Pause className="h-3.5 w-3.5" />
                          {t.pause}
                        </Button>
                        <Button size="sm" variant="outline" onClick={stopSpeaking}>
                          <Square className="h-3.5 w-3.5" />
                          {t.stop}
                        </Button>
                      </>
                    )}

                    {isActiveAudio && playbackState === "paused" && (
                      <>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {t.paused}
                        </span>
                        <Button size="sm" variant="outline" onClick={resumeSpeaking}>
                          <Play className="h-3.5 w-3.5" />
                          {t.resume}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => speakMessage(m)}>
                          <RotateCcw className="h-3.5 w-3.5" />
                          {t.replay}
                        </Button>
                        <Button size="sm" variant="outline" onClick={stopSpeaking}>
                          <Square className="h-3.5 w-3.5" />
                          {t.stop}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Message>
            );
          })}
          {status === "submitted" && <Shimmer>{t.thinking}</Shimmer>}
          {error && (
            <p role="alert" className="rounded-lg border border-destructive/40 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t p-3">
        {(voiceMsg || listening) && (
          <p
            role="status"
            className={`mb-2 flex items-center gap-2 text-sm ${
              listening ? "font-medium text-primary" : "text-destructive"
            }`}
          >
            {listening && (
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" aria-hidden="true" />
            )}
            {listening ? (chatLang === "hi" ? t.listeningHindi : t.listeningEnglish) : voiceMsg}
          </p>
        )}
        <PromptInput onSubmit={(msg) => ask(msg.text)}>
          <PromptInputTextarea
            placeholder={t.placeholder}
            className="text-base"
            lang={chatLang === "hi" ? "hi" : "en"}
          />
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputButton
                onClick={toggleMic}
                aria-label={listening ? t.micOff : t.mic}
                className={listening ? "bg-primary text-primary-foreground" : ""}
              >
                {listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                <span>{listening ? t.micOff : t.mic}</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              onStop={stop}
              disabled={!busy && !controller.textInput.value.trim()}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-xs text-muted-foreground">{t.note}</p>
      </div>
    </section>
  );
}
