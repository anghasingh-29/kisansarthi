import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, type TranslationDictionary } from "./translations";
import type { Language } from "./types";

export const LANGUAGE_STORAGE_KEY = "kisansarthi_lang";
export const LANGUAGE_PROMPT_DISMISSED_KEY = "kisansarthi_lang_prompt_dismissed";

export interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
  showFirstVisitPrompt: boolean;
  dismissFirstVisitPrompt: (chosenLang?: Language) => void;
}

const defaultValue: LanguageContextValue = {
  lang: "en",
  setLang: () => {},
  t: translations.en,
  showFirstVisitPrompt: false,
  dismissFirstVisitPrompt: () => {},
};

const LanguageContext = createContext<LanguageContextValue>(defaultValue);

function readStoredLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "hi" || saved === "en" ? saved : null;
  } catch {
    return null;
  }
}

function isPromptDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(LANGUAGE_PROMPT_DISMISSED_KEY) === "true";
  } catch {
    return true;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [showFirstVisitPrompt, setShowFirstVisitPrompt] = useState(false);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored) {
      setLangState(stored);
      setShowFirstVisitPrompt(false);
    } else if (!isPromptDismissed()) {
      setShowFirstVisitPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
    setShowFirstVisitPrompt(false);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
        window.localStorage.setItem(LANGUAGE_PROMPT_DISMISSED_KEY, "true");
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }
  }, []);

  const dismissFirstVisitPrompt = useCallback(
    (chosenLang?: Language) => {
      if (chosenLang) {
        setLang(chosenLang);
        return;
      }
      setShowFirstVisitPrompt(false);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
          window.localStorage.setItem(LANGUAGE_PROMPT_DISMISSED_KEY, "true");
        } catch {
          // Ignore storage errors
        }
      }
    },
    [lang, setLang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: translations[lang],
      showFirstVisitPrompt,
      dismissFirstVisitPrompt,
    }),
    [lang, setLang, showFirstVisitPrompt, dismissFirstVisitPrompt],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (typeof document !== "undefined" && title) {
      document.title = title;
    }
  }, [title]);
}
