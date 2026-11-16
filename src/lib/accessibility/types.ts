export type FontFamilyOption = "default" | "dyslexic" | "arial" | "verdana" | "open-sans";

export type ColorModeOption =
  | "default"
  | "light"
  | "dark"
  | "high-contrast"
  | "low-contrast"
  | "cream"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia";

export interface AccessibilitySettings {
  // Dyslexia & Readability
  dyslexiaMode: boolean;
  textSpacing: boolean;
  fontFamily: FontFamilyOption;
  letterSpacing: number; // 0 to 0.16 em
  wordSpacing: number; // 0 to 0.50 em
  lineHeight: number; // 0 = website default; otherwise 1.4 to 2.4
  leftAlign: boolean;
  reducedClutter: boolean;
  readingRuler: boolean;

  // Text Size & Scaling
  bodyFontSize: number; // 12 to 32 px (16 = default)
  headingScale: number; // 85 to 160 % (100 = default)
  enlargeControls: boolean;
  interfaceScale: number; // 85 to 135 % (100 = default)

  // Color Accessibility & Personalization
  colorMode: ColorModeOption;
  customColorsEnabled: boolean;
  customTextColor: string;
  customBgColor: string;

  // Color Inversion
  invertColors: boolean;
  preserveImages: boolean;

  // Additional Accessibility
  reduceAnimations: boolean;
  highlightLinks: boolean;
  highlightFocus: boolean;
}

export interface OsAccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersDark: boolean;
  prefersMoreContrast: boolean;
}

export const ACCESSIBILITY_STORAGE_KEY = "kisansarthi_accessibility_settings";

export const BODY_FONT_SIZE_MIN = 12;
export const BODY_FONT_SIZE_MAX = 32;
export const BODY_FONT_SIZE_DEFAULT = 16;

export const HEADING_SCALE_MIN = 85;
export const HEADING_SCALE_MAX = 160;
export const HEADING_SCALE_DEFAULT = 100;

export const INTERFACE_SCALE_MIN = 85;
export const INTERFACE_SCALE_MAX = 135;
export const INTERFACE_SCALE_DEFAULT = 100;

export const LETTER_SPACING_MIN = 0;
export const LETTER_SPACING_MAX = 0.16;
export const LETTER_SPACING_STEP = 0.01;

export const WORD_SPACING_MIN = 0;
export const WORD_SPACING_MAX = 0.5;
export const WORD_SPACING_STEP = 0.05;

export const LINE_HEIGHT_CUSTOM_MIN = 1.4;
export const LINE_HEIGHT_CUSTOM_MAX = 2.4;
export const LINE_HEIGHT_STEP = 0.1;

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  dyslexiaMode: false,
  textSpacing: false,
  fontFamily: "default",
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 0,
  leftAlign: false,
  reducedClutter: false,
  readingRuler: false,

  bodyFontSize: BODY_FONT_SIZE_DEFAULT,
  headingScale: HEADING_SCALE_DEFAULT,
  enlargeControls: false,
  interfaceScale: INTERFACE_SCALE_DEFAULT,

  colorMode: "default",
  customColorsEnabled: false,
  customTextColor: "#1d3024",
  customBgColor: "#ffffff",

  invertColors: false,
  preserveImages: true,

  reduceAnimations: false,
  highlightLinks: false,
  highlightFocus: false,
};

export const FONT_FAMILY_STACKS: Record<FontFamilyOption, string> = {
  default: '"Poppins", ui-sans-serif, system-ui, sans-serif',
  dyslexic: '"OpenDyslexic", "Lexend", "Comic Sans MS", Verdana, sans-serif',
  arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  verdana: "Verdana, Geneva, sans-serif",
  "open-sans": '"Open Sans", ui-sans-serif, system-ui, sans-serif',
};

const VALID_FONT_FAMILIES = new Set<FontFamilyOption>(["default", "dyslexic", "arial", "verdana", "open-sans"]);
const VALID_COLOR_MODES = new Set<ColorModeOption>([
  "default",
  "light",
  "dark",
  "high-contrast",
  "low-contrast",
  "cream",
  "protanopia",
  "deuteranopia",
  "tritanopia",
]);

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function normalizeHexColor(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return fallback;
}

export function sanitizeAccessibilitySettings(raw: unknown): AccessibilitySettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_ACCESSIBILITY_SETTINGS };
  const input = raw as Partial<Record<keyof AccessibilitySettings, unknown>>;

  const fontFamily = VALID_FONT_FAMILIES.has(input.fontFamily as FontFamilyOption)
    ? (input.fontFamily as FontFamilyOption)
    : DEFAULT_ACCESSIBILITY_SETTINGS.fontFamily;

  const colorMode = VALID_COLOR_MODES.has(input.colorMode as ColorModeOption)
    ? (input.colorMode as ColorModeOption)
    : DEFAULT_ACCESSIBILITY_SETTINGS.colorMode;

  const rawLineHeight = typeof input.lineHeight === "number" ? input.lineHeight : 0;
  const lineHeight =
    rawLineHeight === 0
      ? 0
      : Math.round(clampNumber(rawLineHeight, LINE_HEIGHT_CUSTOM_MIN, LINE_HEIGHT_CUSTOM_MAX, 1.6) * 10) / 10;

  return {
    dyslexiaMode: typeof input.dyslexiaMode === "boolean" ? input.dyslexiaMode : false,
    textSpacing: typeof input.textSpacing === "boolean" ? input.textSpacing : false,
    fontFamily,
    letterSpacing:
      Math.round(clampNumber(input.letterSpacing, LETTER_SPACING_MIN, LETTER_SPACING_MAX, 0) * 100) / 100,
    wordSpacing: Math.round(clampNumber(input.wordSpacing, WORD_SPACING_MIN, WORD_SPACING_MAX, 0) * 100) / 100,
    lineHeight,
    leftAlign: typeof input.leftAlign === "boolean" ? input.leftAlign : false,
    reducedClutter: typeof input.reducedClutter === "boolean" ? input.reducedClutter : false,
    readingRuler: typeof input.readingRuler === "boolean" ? input.readingRuler : false,

    bodyFontSize: Math.round(
      clampNumber(input.bodyFontSize, BODY_FONT_SIZE_MIN, BODY_FONT_SIZE_MAX, BODY_FONT_SIZE_DEFAULT),
    ),
    headingScale: Math.round(
      clampNumber(input.headingScale, HEADING_SCALE_MIN, HEADING_SCALE_MAX, HEADING_SCALE_DEFAULT),
    ),
    enlargeControls: typeof input.enlargeControls === "boolean" ? input.enlargeControls : false,
    interfaceScale: Math.round(
      clampNumber(input.interfaceScale, INTERFACE_SCALE_MIN, INTERFACE_SCALE_MAX, INTERFACE_SCALE_DEFAULT),
    ),

    colorMode,
    customColorsEnabled: typeof input.customColorsEnabled === "boolean" ? input.customColorsEnabled : false,
    customTextColor: normalizeHexColor(input.customTextColor, DEFAULT_ACCESSIBILITY_SETTINGS.customTextColor),
    customBgColor: normalizeHexColor(input.customBgColor, DEFAULT_ACCESSIBILITY_SETTINGS.customBgColor),

    invertColors: typeof input.invertColors === "boolean" ? input.invertColors : false,
    preserveImages: typeof input.preserveImages === "boolean" ? input.preserveImages : true,

    reduceAnimations: typeof input.reduceAnimations === "boolean" ? input.reduceAnimations : false,
    highlightLinks: typeof input.highlightLinks === "boolean" ? input.highlightLinks : false,
    highlightFocus: typeof input.highlightFocus === "boolean" ? input.highlightFocus : false,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = normalizeHexColor(hex, "#000000").slice(1);
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clampByte = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clampByte(r), clampByte(g), clampByte(b)]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function mixHexColors(baseHex: string, targetHex: string, weight: number): string {
  const [r1, g1, b1] = hexToRgb(baseHex);
  const [r2, g2, b2] = hexToRgb(targetHex);
  return rgbToHex(r1 + (r2 - r1) * weight, g1 + (g2 - g1) * weight, b1 + (b2 - b1) * weight);
}

export function getRelativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function deriveCustomPalette(textHex: string, bgHex: string) {
  const fg = normalizeHexColor(textHex, DEFAULT_ACCESSIBILITY_SETTINGS.customTextColor);
  const bg = normalizeHexColor(bgHex, DEFAULT_ACCESSIBILITY_SETTINGS.customBgColor);
  const isDarkBg = getRelativeLuminance(bg) < 0.2;

  return {
    background: bg,
    foreground: fg,
    surface: mixHexColors(bg, fg, isDarkBg ? 0.08 : 0.04),
    card: mixHexColors(bg, fg, isDarkBg ? 0.1 : 0.03),
    popover: mixHexColors(bg, fg, isDarkBg ? 0.12 : 0.02),
    secondary: mixHexColors(bg, fg, isDarkBg ? 0.16 : 0.08),
    secondaryForeground: fg,
    muted: mixHexColors(bg, fg, isDarkBg ? 0.14 : 0.07),
    mutedForeground: mixHexColors(bg, fg, 0.72),
    accent: mixHexColors(bg, fg, isDarkBg ? 0.18 : 0.1),
    accentForeground: fg,
    border: mixHexColors(bg, fg, isDarkBg ? 0.28 : 0.2),
    input: mixHexColors(bg, fg, isDarkBg ? 0.3 : 0.22),
    primary: fg,
    primaryForeground: bg,
    ring: fg,
    goldSoft: mixHexColors(bg, fg, isDarkBg ? 0.18 : 0.09),
    goldForeground: fg,
    successSoft: mixHexColors(bg, fg, isDarkBg ? 0.18 : 0.09),
    success: fg,
    neutralSoft: mixHexColors(bg, fg, isDarkBg ? 0.14 : 0.06),
  };
}
