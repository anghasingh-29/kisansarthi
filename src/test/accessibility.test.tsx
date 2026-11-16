import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AccessibilityControl } from "@/components/site/AccessibilityPanel";
import { ReadingRuler } from "@/components/site/ReadingRuler";
import {
  ACCESSIBILITY_STORAGE_KEY,
  AccessibilityProvider,
  BODY_FONT_SIZE_DEFAULT,
  BODY_FONT_SIZE_MAX,
  BODY_FONT_SIZE_MIN,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  deriveCustomPalette,
  getContrastRatio,
  sanitizeAccessibilitySettings,
} from "@/lib/accessibility";
import { LanguageProvider, useLanguage } from "@/lib/i18n";

function mockMatchMedia(overrides?: Partial<Record<string, boolean>>) {
  window.matchMedia = vi.fn((query: string) => {
    const matches = Boolean(overrides?.[query]);
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  });
}

function LanguageToggleHelper() {
  const { lang, setLang } = useLanguage();
  return (
    <button type="button" data-testid="switch-lang" onClick={() => setLang(lang === "en" ? "hi" : "en")}>
      {lang}
    </button>
  );
}

function renderAccessibilityHarness() {
  return render(
    <LanguageProvider>
      <AccessibilityProvider>
        <header>
          <LanguageToggleHelper />
        </header>
        <main id="main-content">
          <h1>KisanSarthi</h1>
          <p>Explore farmer schemes</p>
          <a href="/schemes">Browse Schemes</a>
          <img src="/sample.jpg" alt="Farmer in field" />
        </main>
        <AccessibilityControl />
        <ReadingRuler />
      </AccessibilityProvider>
    </LanguageProvider>,
  );
}

describe("Accessibility sanitization & WCAG contrast utilities", () => {
  it("clamps font size, heading scale, interface scale, and normalizes hex colors", () => {
    const sanitized = sanitizeAccessibilitySettings({
      dyslexiaMode: true,
      textSpacing: true,
      bodyFontSize: 99,
      headingScale: 250,
      interfaceScale: 40,
      letterSpacing: 1,
      wordSpacing: -5,
      lineHeight: 5,
      customTextColor: "#abc",
      customBgColor: "invalid-hex",
      colorMode: "protanopia",
      fontFamily: "dyslexic",
    });

    expect(sanitized.dyslexiaMode).toBe(true);
    expect(sanitized.textSpacing).toBe(true);
    expect(sanitized.bodyFontSize).toBe(BODY_FONT_SIZE_MAX);
    expect(sanitized.headingScale).toBe(160);
    expect(sanitized.interfaceScale).toBe(85);
    expect(sanitized.letterSpacing).toBe(0.16);
    expect(sanitized.wordSpacing).toBe(0);
    expect(sanitized.lineHeight).toBe(2.4);
    expect(sanitized.customTextColor).toBe("#aabbcc");
    expect(sanitized.customBgColor).toBe(DEFAULT_ACCESSIBILITY_SETTINGS.customBgColor);
    expect(sanitized.colorMode).toBe("protanopia");
    expect(sanitized.fontFamily).toBe("dyslexic");

    const minClamped = sanitizeAccessibilitySettings({ bodyFontSize: 4 });
    expect(minClamped.bodyFontSize).toBe(BODY_FONT_SIZE_MIN);
  });

  it("calculates WCAG contrast ratios and derives cohesive custom palettes", () => {
    expect(getContrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(getContrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 2);
    expect(getContrastRatio("#999999", "#ffffff")).toBeLessThan(4.5);

    const darkPalette = deriveCustomPalette("#f8fafc", "#0f172a");
    expect(darkPalette.background).toBe("#0f172a");
    expect(darkPalette.foreground).toBe("#f8fafc");
    expect(darkPalette.primary).toBe("#f8fafc");
  });
});

describe("Accessibility & Personalization System UI & DOM integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
    for (const key of Object.keys(document.documentElement.dataset)) {
      delete document.documentElement.dataset[key];
    }
    mockMatchMedia();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders bottom accessibility button, omits removed spacing/font/motion controls, and shows all kept options together", () => {
    renderAccessibilityHarness();

    const trigger = screen.getByTestId("accessibility-floating-button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.className).toContain("fixed");
    expect(trigger.className).toContain("bottom-4");
    expect(trigger.className).toContain("left-4");
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: /^accessibility$/i });
    expect(dialog).toBeInTheDocument();

    // Removed controls must not appear
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: /letter spacing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: /word spacing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("slider", { name: /line spacing/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /arial/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /verdana/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /open sans/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reduce animations/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /highlight keyboard focus/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /high contrast/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /protanopia/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /use custom colors/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /invert website colors/i })).not.toBeInTheDocument();

    // Requested button options appear cleanly in one view
    expect(screen.getByRole("button", { name: /dyslexia mode/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /^text space$/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /highlight all links/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("radio", { name: /^light$/i })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /^dark$/i })).toHaveAttribute("aria-checked", "false");

    // Bilingual translation check
    fireEvent.click(screen.getByTestId("switch-lang"));
    expect(screen.getByRole("heading", { name: /^सुगम्यता$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("switch-lang"));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByTestId("accessibility-floating-button")).toBeInTheDocument();
  });

  it("toggles Text Space on/off and Dyslexia Mode all-in-one preset cleanly", () => {
    renderAccessibilityHarness();
    fireEvent.click(screen.getByTestId("accessibility-floating-button"));

    // Toggle Text Space ON -> applies wider letter/word/line spacing
    const textSpaceBtn = screen.getByRole("button", { name: /^text space$/i });
    fireEvent.click(textSpaceBtn);
    expect(textSpaceBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset["a11yTextSpacing"]).toBe("true");
    expect(document.documentElement.style.getPropertyValue("--a11y-letter-spacing")).toBe("0.06em");
    expect(document.documentElement.style.getPropertyValue("--a11y-word-spacing")).toBe("0.16em");
    expect(document.documentElement.style.getPropertyValue("--a11y-line-height")).toBe("1.8");

    // Toggle Text Space OFF -> clears spacing overrides
    fireEvent.click(textSpaceBtn);
    expect(textSpaceBtn).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset["a11yTextSpacing"]).toBeUndefined();
    expect(document.documentElement.style.getPropertyValue("--a11y-letter-spacing")).toBe("");

    // Click Dyslexia Mode -> turns on dyslexia font, text spacing, left alignment, reduced clutter, 18px size, and warm cream background
    const dyslexiaBtn = screen.getByRole("button", { name: /dyslexia mode/i });
    fireEvent.click(dyslexiaBtn);
    expect(dyslexiaBtn).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset["a11yDyslexia"]).toBe("true");
    expect(document.documentElement.dataset["a11yFont"]).toBe("dyslexic");
    expect(document.documentElement.style.getPropertyValue("--a11y-font-family")).toContain("Lexend");
    expect(document.documentElement.dataset["a11yTextSpacing"]).toBe("true");
    expect(document.documentElement.dataset["a11yLeftAlign"]).toBe("true");
    expect(document.documentElement.dataset["a11yReducedClutter"]).toBe("true");
    expect(document.documentElement.dataset["a11yColorMode"]).toBe("cream");
    expect(document.documentElement.dataset["a11yBodySized"]).toBe("true");

    // Clicking Dyslexia Mode again restores defaults cleanly
    fireEvent.click(dyslexiaBtn);
    expect(dyslexiaBtn).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.dataset["a11yDyslexia"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yFont"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yColorMode"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yBodySized"]).toBeUndefined();
  });

  it("controls text size (A-, A, A+, 12px-32px slider), heading scale, interface scale, and enlarged controls", () => {
    renderAccessibilityHarness();
    fireEvent.click(screen.getByTestId("accessibility-floating-button"));

    expect(screen.getByTestId("a11y-body-size-readout")).toHaveTextContent("16px (Default)");

    // Increase via A+
    fireEvent.click(screen.getByRole("button", { name: /A\+/i }));
    expect(screen.getByTestId("a11y-body-size-readout")).toHaveTextContent("18px");
    expect(document.documentElement.dataset["a11yBodySized"]).toBe("true");
    expect(document.documentElement.style.getPropertyValue("--a11y-body-scale")).toBe("1.125");

    // Set max (32px) and min (12px) via slider
    const bodySlider = screen.getByRole("slider", { name: /body text size/i });
    fireEvent.change(bodySlider, { target: { value: "32" } });
    expect(screen.getByTestId("a11y-body-size-readout")).toHaveTextContent("32px");
    expect(screen.getByRole("button", { name: /A\+/i })).toBeDisabled();

    fireEvent.change(bodySlider, { target: { value: "12" } });
    expect(screen.getByTestId("a11y-body-size-readout")).toHaveTextContent("12px");
    expect(screen.getByRole("button", { name: /A-/i })).toBeDisabled();

    // Reset via A button
    fireEvent.click(screen.getByRole("button", { name: /^A \(Default\)$/i }));
    expect(screen.getByTestId("a11y-body-size-readout")).toHaveTextContent(`${BODY_FONT_SIZE_DEFAULT}px`);
    expect(document.documentElement.dataset["a11yBodySized"]).toBeUndefined();

    // Independent heading scale & interface scale
    fireEvent.change(screen.getByLabelText(/heading size/i), { target: { value: "140" } });
    expect(document.documentElement.dataset["a11yHeadingScaled"]).toBe("true");
    expect(document.documentElement.style.getPropertyValue("--a11y-heading-scale")).toBe("1.4");

    fireEvent.change(screen.getByLabelText(/interface scale/i), { target: { value: "120" } });
    expect(document.documentElement.dataset["a11yInterfaceScaled"]).toBe("true");
    expect(document.documentElement.style.getPropertyValue("--a11y-ui-scale")).toBe("1.2");

    // Enlarge menus & buttons
    fireEvent.click(screen.getByRole("button", { name: /enlarge menus & buttons/i }));
    expect(document.documentElement.dataset["a11yEnlargeControls"]).toBe("true");
  });

  it("supports left-align, reduced clutter, reading ruler, highlight links, and Light/Dark modes only", () => {
    renderAccessibilityHarness();
    fireEvent.click(screen.getByTestId("accessibility-floating-button"));

    fireEvent.click(screen.getByRole("button", { name: /highlight all links/i }));
    expect(document.documentElement.dataset["a11yHighlightLinks"]).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /left-align text/i }));
    expect(document.documentElement.dataset["a11yLeftAlign"]).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /reduced visual clutter/i }));
    expect(document.documentElement.dataset["a11yReducedClutter"]).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: /reading ruler guide/i }));
    const ruler = screen.getByTestId("reading-ruler");
    expect(ruler).toBeInTheDocument();
    act(() => {
      fireEvent.mouseMove(window, { clientY: 340 });
    });
    expect(ruler.style.top).toBe("312px");

    // Switch to Dark mode and back to Light mode
    fireEvent.click(screen.getByRole("radio", { name: /^dark$/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset["a11yColorMode"]).toBe("dark");

    fireEvent.click(screen.getByRole("radio", { name: /^light$/i }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.dataset["a11yColorMode"]).toBeUndefined();
  });

  it("persists combined settings across refresh and resets cleanly to defaults", () => {
    const { unmount } = renderAccessibilityHarness();

    fireEvent.click(screen.getByTestId("accessibility-floating-button"));
    fireEvent.click(screen.getByRole("button", { name: /dyslexia mode/i }));
    fireEvent.click(screen.getByRole("button", { name: /highlight all links/i }));
    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));

    expect(screen.getByTestId("a11y-active-badge")).toHaveTextContent("4");
    expect(window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)).toBeTruthy();

    // Unmount and remount to verify persistence across refresh
    unmount();
    renderAccessibilityHarness();

    expect(document.documentElement.dataset["a11yDyslexia"]).toBe("true");
    expect(document.documentElement.dataset["a11yFont"]).toBe("dyslexic");
    expect(document.documentElement.dataset["a11yTextSpacing"]).toBe("true");
    expect(document.documentElement.dataset["a11yHighlightLinks"]).toBe("true");

    // Reset to default clears overrides
    fireEvent.click(screen.getByTestId("accessibility-floating-button"));
    fireEvent.click(screen.getByRole("button", { name: /reset to default/i }));

    expect(document.documentElement.dataset["a11yDyslexia"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yFont"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yTextSpacing"]).toBeUndefined();
    expect(document.documentElement.dataset["a11yHighlightLinks"]).toBeUndefined();
    expect(window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY)).toBeNull();
  });
});
