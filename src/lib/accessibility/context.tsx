import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCESSIBILITY_STORAGE_KEY,
  BODY_FONT_SIZE_DEFAULT,
  BODY_FONT_SIZE_MAX,
  BODY_FONT_SIZE_MIN,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  deriveCustomPalette,
  FONT_FAMILY_STACKS,
  INTERFACE_SCALE_DEFAULT,
  sanitizeAccessibilitySettings,
  type AccessibilitySettings,
  type OsAccessibilityPreferences,
} from "./types";

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  osPreferences: OsAccessibilityPreferences;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  updateSettings: (patch: Partial<AccessibilitySettings>) => void;
  toggleDyslexiaMode: () => void;
  toggleTextSpacing: () => void;
  resetSettings: () => void;
  applyOsPreferences: () => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  activeFeatureCount: number;
}

const DEFAULT_OS_PREFS: OsAccessibilityPreferences = {
  prefersReducedMotion: false,
  prefersDark: false,
  prefersMoreContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function readStoredAccessibilitySettings(): {
  settings: AccessibilitySettings;
  hasStoredSettings: boolean;
} {
  if (typeof window === "undefined") {
    return { settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS }, hasStoredSettings: false };
  }
  try {
    const raw = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!raw) {
      return { settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS }, hasStoredSettings: false };
    }
    const parsed = JSON.parse(raw) as unknown;
    return {
      settings: sanitizeAccessibilitySettings(parsed),
      hasStoredSettings: true,
    };
  } catch {
    return { settings: { ...DEFAULT_ACCESSIBILITY_SETTINGS }, hasStoredSettings: false };
  }
}

export function writeStoredAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota or privacy-mode errors
  }
}

export function clearStoredAccessibilitySettings(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

const CUSTOM_CSS_VAR_KEYS = [
  "--background",
  "--foreground",
  "--surface",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--primary",
  "--primary-foreground",
  "--ring",
  "--gold-soft",
  "--gold-foreground",
  "--success-soft",
  "--success",
  "--neutral-soft",
] as const;

export function applyAccessibilityToDocument(
  settings: AccessibilitySettings,
  osPreferences: OsAccessibilityPreferences = DEFAULT_OS_PREFS,
): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Color modes & Tailwind .dark support
  root.classList.toggle("dark", !settings.customColorsEnabled && settings.colorMode === "dark");

  if (!settings.customColorsEnabled && settings.colorMode !== "default") {
    root.dataset["a11yColorMode"] = settings.colorMode;
  } else {
    delete root.dataset["a11yColorMode"];
  }

  // Custom colors
  if (settings.customColorsEnabled) {
    root.dataset["a11yCustomColors"] = "true";
    const palette = deriveCustomPalette(settings.customTextColor, settings.customBgColor);
    root.style.setProperty("--background", palette.background);
    root.style.setProperty("--foreground", palette.foreground);
    root.style.setProperty("--surface", palette.surface);
    root.style.setProperty("--card", palette.card);
    root.style.setProperty("--card-foreground", palette.foreground);
    root.style.setProperty("--popover", palette.popover);
    root.style.setProperty("--popover-foreground", palette.foreground);
    root.style.setProperty("--secondary", palette.secondary);
    root.style.setProperty("--secondary-foreground", palette.secondaryForeground);
    root.style.setProperty("--muted", palette.muted);
    root.style.setProperty("--muted-foreground", palette.mutedForeground);
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent-foreground", palette.accentForeground);
    root.style.setProperty("--border", palette.border);
    root.style.setProperty("--input", palette.input);
    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--primary-foreground", palette.primaryForeground);
    root.style.setProperty("--ring", palette.ring);
    root.style.setProperty("--gold-soft", palette.goldSoft);
    root.style.setProperty("--gold-foreground", palette.goldForeground);
    root.style.setProperty("--success-soft", palette.successSoft);
    root.style.setProperty("--success", palette.success);
    root.style.setProperty("--neutral-soft", palette.neutralSoft);
  } else {
    delete root.dataset["a11yCustomColors"];
    for (const key of CUSTOM_CSS_VAR_KEYS) {
      root.style.removeProperty(key);
    }
  }

  // Font family
  if (settings.fontFamily !== "default") {
    root.dataset["a11yFont"] = settings.fontFamily;
    root.style.setProperty("--a11y-font-family", FONT_FAMILY_STACKS[settings.fontFamily]);
  } else {
    delete root.dataset["a11yFont"];
    root.style.removeProperty("--a11y-font-family");
  }

  // Body text size (12px - 32px)
  if (settings.bodyFontSize !== BODY_FONT_SIZE_DEFAULT) {
    root.dataset["a11yBodySized"] = "true";
    root.style.setProperty("--a11y-body-size", `${settings.bodyFontSize / 16}rem`);
    root.style.setProperty("--a11y-body-scale", String(settings.bodyFontSize / 16));
  } else {
    delete root.dataset["a11yBodySized"];
    root.style.removeProperty("--a11y-body-size");
    root.style.removeProperty("--a11y-body-scale");
  }

  // Heading scale (85% - 160%)
  if (settings.headingScale !== 100) {
    root.dataset["a11yHeadingScaled"] = "true";
    root.style.setProperty("--a11y-heading-scale", String(settings.headingScale / 100));
  } else {
    delete root.dataset["a11yHeadingScaled"];
    root.style.removeProperty("--a11y-heading-scale");
  }

  // Interface scale (85% - 135%)
  if (settings.interfaceScale !== INTERFACE_SCALE_DEFAULT) {
    root.dataset["a11yInterfaceScaled"] = "true";
    root.style.setProperty("--a11y-ui-scale", String(settings.interfaceScale / 100));
  } else {
    delete root.dataset["a11yInterfaceScaled"];
    root.style.removeProperty("--a11y-ui-scale");
  }

  // Spacing & line height (supports single Text Space toggle or explicit numeric overrides)
  const effectiveLetterSpacing = settings.letterSpacing > 0 ? settings.letterSpacing : settings.textSpacing ? 0.06 : 0;
  const effectiveWordSpacing = settings.wordSpacing > 0 ? settings.wordSpacing : settings.textSpacing ? 0.16 : 0;
  const effectiveLineHeight = settings.lineHeight > 0 ? settings.lineHeight : settings.textSpacing ? 1.8 : 0;

  if (effectiveLetterSpacing > 0) {
    root.dataset["a11yLetterSpacing"] = "true";
    root.style.setProperty("--a11y-letter-spacing", `${effectiveLetterSpacing}em`);
  } else {
    delete root.dataset["a11yLetterSpacing"];
    root.style.removeProperty("--a11y-letter-spacing");
  }

  if (effectiveWordSpacing > 0) {
    root.dataset["a11yWordSpacing"] = "true";
    root.style.setProperty("--a11y-word-spacing", `${effectiveWordSpacing}em`);
  } else {
    delete root.dataset["a11yWordSpacing"];
    root.style.removeProperty("--a11y-word-spacing");
  }

  if (effectiveLineHeight > 0) {
    root.dataset["a11yLineHeight"] = "true";
    root.style.setProperty("--a11y-line-height", String(effectiveLineHeight));
  } else {
    delete root.dataset["a11yLineHeight"];
    root.style.removeProperty("--a11y-line-height");
  }

  // Boolean flags
  const toggleFlag = (key: string, enabled: boolean) => {
    if (enabled) root.dataset[key] = "true";
    else delete root.dataset[key];
  };

  toggleFlag("a11yDyslexia", settings.dyslexiaMode);
  toggleFlag("a11yTextSpacing", settings.textSpacing);
  toggleFlag("a11yLeftAlign", settings.leftAlign);
  toggleFlag("a11yReducedClutter", settings.reducedClutter);
  toggleFlag("a11yEnlargeControls", settings.enlargeControls);
  toggleFlag("a11yInvert", settings.invertColors);
  toggleFlag("a11yPreserveImages", settings.invertColors && settings.preserveImages);
  toggleFlag("a11yReduceMotion", settings.reduceAnimations || osPreferences.prefersReducedMotion);
  toggleFlag("a11yHighlightLinks", settings.highlightLinks);
  toggleFlag("a11yHighlightFocus", settings.highlightFocus);
}

export function countActiveAccessibilityFeatures(settings: AccessibilitySettings): number {
  let count = 0;
  if (settings.dyslexiaMode) count++;
  if (settings.textSpacing || settings.letterSpacing !== 0 || settings.wordSpacing !== 0 || settings.lineHeight !== 0) {
    count++;
  }
  if (!settings.dyslexiaMode && settings.fontFamily !== DEFAULT_ACCESSIBILITY_SETTINGS.fontFamily) count++;
  if (!settings.dyslexiaMode && settings.leftAlign) count++;
  if (!settings.dyslexiaMode && settings.reducedClutter) count++;
  if (settings.readingRuler) count++;
  if (settings.bodyFontSize !== BODY_FONT_SIZE_DEFAULT) count++;
  if (settings.headingScale !== 100) count++;
  if (settings.enlargeControls) count++;
  if (settings.interfaceScale !== INTERFACE_SCALE_DEFAULT) count++;
  if (!settings.dyslexiaMode && settings.colorMode !== "default") count++;
  if (settings.customColorsEnabled) count++;
  if (settings.invertColors) count++;
  if (settings.reduceAnimations) count++;
  if (settings.highlightLinks) count++;
  if (settings.highlightFocus) count++;
  return count;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({ ...DEFAULT_ACCESSIBILITY_SETTINGS });
  const [osPreferences, setOsPreferences] = useState<OsAccessibilityPreferences>(DEFAULT_OS_PREFS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted settings and subscribe to OS accessibility preferences
  useEffect(() => {
    const readOs = (): OsAccessibilityPreferences => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return DEFAULT_OS_PREFS;
      }
      return {
        prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
        prefersMoreContrast: window.matchMedia("(prefers-contrast: more)").matches,
      };
    };

    const currentOs = readOs();
    setOsPreferences(currentOs);

    const { settings: stored, hasStoredSettings } = readStoredAccessibilitySettings();
    const initial =
      !hasStoredSettings && currentOs.prefersReducedMotion
        ? { ...stored, reduceAnimations: true }
        : stored;

    setSettings(initial);
    applyAccessibilityToDocument(initial, currentOs);
    setHydrated(true);

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const contrastMq = window.matchMedia("(prefers-contrast: more)");

    const onMediaChange = () => setOsPreferences(readOs());
    motionMq.addEventListener?.("change", onMediaChange);
    darkMq.addEventListener?.("change", onMediaChange);
    contrastMq.addEventListener?.("change", onMediaChange);
    return () => {
      motionMq.removeEventListener?.("change", onMediaChange);
      darkMq.removeEventListener?.("change", onMediaChange);
      contrastMq.removeEventListener?.("change", onMediaChange);
    };
  }, []);

  // Sync every change to DOM CSS variables/attributes and localStorage
  useEffect(() => {
    if (!hydrated) return;
    applyAccessibilityToDocument(settings, osPreferences);
    if (countActiveAccessibilityFeatures(settings) === 0) {
      clearStoredAccessibilitySettings();
    } else {
      writeStoredAccessibilitySettings(settings);
    }
  }, [settings, osPreferences, hydrated]);

  const updateSettings = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((prev) => sanitizeAccessibilitySettings({ ...prev, ...patch }));
  }, []);

  const toggleTextSpacing = useCallback(() => {
    setSettings((prev) => {
      const currentlyActive =
        prev.textSpacing || prev.letterSpacing > 0 || prev.wordSpacing > 0 || prev.lineHeight > 0;
      return sanitizeAccessibilitySettings({
        ...prev,
        textSpacing: !currentlyActive,
        letterSpacing: 0,
        wordSpacing: 0,
        lineHeight: 0,
      });
    });
  }, []);

  const toggleDyslexiaMode = useCallback(() => {
    setSettings((prev) => {
      if (!prev.dyslexiaMode) {
        return sanitizeAccessibilitySettings({
          ...prev,
          dyslexiaMode: true,
          fontFamily: "dyslexic",
          textSpacing: true,
          letterSpacing: 0,
          wordSpacing: 0,
          lineHeight: 0,
          leftAlign: true,
          reducedClutter: true,
          bodyFontSize: Math.max(prev.bodyFontSize, 18),
          colorMode: prev.colorMode === "default" || prev.colorMode === "light" ? "cream" : prev.colorMode,
        });
      }
      return sanitizeAccessibilitySettings({
        ...prev,
        dyslexiaMode: false,
        fontFamily: "default",
        textSpacing: false,
        letterSpacing: 0,
        wordSpacing: 0,
        lineHeight: 0,
        leftAlign: false,
        reducedClutter: false,
        bodyFontSize: prev.bodyFontSize === 18 ? BODY_FONT_SIZE_DEFAULT : prev.bodyFontSize,
        colorMode: prev.colorMode === "cream" ? "default" : prev.colorMode,
      });
    });
  }, []);

  const resetSettings = useCallback(() => {
    const clean = { ...DEFAULT_ACCESSIBILITY_SETTINGS };
    setSettings(clean);
    clearStoredAccessibilitySettings();
    applyAccessibilityToDocument(clean, osPreferences);
  }, [osPreferences]);

  const applyOsPreferences = useCallback(() => {
    setSettings((prev) =>
      sanitizeAccessibilitySettings({
        ...prev,
        reduceAnimations: osPreferences.prefersReducedMotion,
        colorMode: osPreferences.prefersMoreContrast
          ? "high-contrast"
          : osPreferences.prefersDark
            ? "dark"
            : "default",
        customColorsEnabled: false,
      }),
    );
  }, [osPreferences]);

  const increaseTextSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      bodyFontSize: Math.min(BODY_FONT_SIZE_MAX, prev.bodyFontSize + 2),
    }));
  }, []);

  const decreaseTextSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      bodyFontSize: Math.max(BODY_FONT_SIZE_MIN, prev.bodyFontSize - 2),
    }));
  }, []);

  const resetTextSize = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      bodyFontSize: BODY_FONT_SIZE_DEFAULT,
    }));
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen((prev) => !prev);
  }, []);

  const activeFeatureCount = useMemo(() => countActiveAccessibilityFeatures(settings), [settings]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      osPreferences,
      panelOpen,
      setPanelOpen,
      togglePanel,
      updateSettings,
      toggleDyslexiaMode,
      toggleTextSpacing,
      resetSettings,
      applyOsPreferences,
      increaseTextSize,
      decreaseTextSize,
      resetTextSize,
      activeFeatureCount,
    }),
    [
      settings,
      osPreferences,
      panelOpen,
      togglePanel,
      updateSettings,
      toggleDyslexiaMode,
      toggleTextSpacing,
      resetSettings,
      applyOsPreferences,
      increaseTextSize,
      decreaseTextSize,
      resetTextSize,
      activeFeatureCount,
    ],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used inside AccessibilityProvider");
  }
  return ctx;
}
