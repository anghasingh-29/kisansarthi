import { useEffect, useId, useRef, type ReactNode } from "react";
import { Accessibility, Check, Moon, RotateCcw, Sun, X } from "lucide-react";
import {
  BODY_FONT_SIZE_DEFAULT,
  BODY_FONT_SIZE_MAX,
  BODY_FONT_SIZE_MIN,
  HEADING_SCALE_MAX,
  HEADING_SCALE_MIN,
  INTERFACE_SCALE_MAX,
  INTERFACE_SCALE_MIN,
  useAccessibility,
} from "@/lib/accessibility";
import { useLanguage } from "@/lib/i18n";

function OptionToggleButton({
  label,
  title,
  active,
  onClick,
  fullWidth = false,
}: {
  label: string;
  title: string;
  active: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      title={title}
      onClick={onClick}
      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        fullWidth ? "col-span-2" : ""
      } ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-surface text-foreground hover:bg-secondary"
      }`}
    >
      <span className="min-w-0 leading-snug">{label}</span>
      {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    </button>
  );
}

function CompactSlider({
  id,
  label,
  title,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  title: string;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div title={title} className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-foreground">
          {label}
        </label>
        <span className="font-mono text-[11px] font-semibold text-primary tabular-nums">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

function SectionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2.5" aria-label={title}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

export function AccessibilityControl() {
  const { panelOpen, setPanelOpen, activeFeatureCount } = useAccessibility();
  const { t } = useLanguage();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const a = t.accessibility;

  return (
    <>
      {!panelOpen && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-expanded={panelOpen}
          aria-haspopup="dialog"
          aria-controls={panelId}
          aria-label={a.triggerAriaLabel}
          title={a.triggerAriaLabel}
          data-a11y-panel-ui="true"
          data-testid="accessibility-floating-button"
          className="fixed bottom-4 left-4 z-40 flex max-w-[calc(100vw-9.5rem)] items-center gap-2 rounded-full border border-primary/30 bg-background py-2 pl-2 pr-3.5 text-sm font-semibold text-primary shadow-card transition-transform hover:scale-105 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none sm:bottom-6 sm:left-6 sm:pl-2.5 sm:pr-4 sm:text-base"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground sm:h-10 sm:w-10">
            <Accessibility className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate">{a.triggerLabel}</span>
          {activeFeatureCount > 0 && (
            <span
              data-testid="a11y-active-badge"
              className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary px-1.5 font-mono text-xs font-bold text-primary-foreground tabular-nums"
            >
              {activeFeatureCount}
            </span>
          )}
        </button>
      )}

      {panelOpen && (
        <AccessibilityPanel
          panelId={panelId}
          onClose={() => {
            setPanelOpen(false);
            window.requestAnimationFrame(() => triggerRef.current?.focus());
          }}
        />
      )}
    </>
  );
}

export function AccessibilityPanel({ panelId, onClose }: { panelId: string; onClose: () => void }) {
  const {
    settings,
    updateSettings,
    toggleDyslexiaMode,
    toggleTextSpacing,
    resetSettings,
    increaseTextSize,
    decreaseTextSize,
    resetTextSize,
  } = useAccessibility();
  const { t } = useLanguage();
  const a = t.accessibility;

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const isDark = settings.colorMode === "dark";

  return (
    <div
      data-a11y-panel-ui="true"
      data-a11y-panel-shell="true"
      className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full w-full max-w-md flex-col border-r bg-background text-foreground shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Accessibility className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 id={titleId} className="text-base font-bold text-foreground">
              {a.triggerLabel}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={a.closePanel}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-surface text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          {/* Reading & Links */}
          <SectionGroup title={a.dyslexia.readingLinksTitle}>
            <div className="grid grid-cols-2 gap-2">
              <OptionToggleButton
                label={a.dyslexia.dyslexiaModeLabel}
                title={a.dyslexia.dyslexiaModeDesc}
                active={settings.dyslexiaMode}
                onClick={toggleDyslexiaMode}
                fullWidth
              />
              <OptionToggleButton
                label={a.dyslexia.textSpaceLabel}
                title={a.dyslexia.textSpaceDesc}
                active={settings.textSpacing}
                onClick={toggleTextSpacing}
              />
              <OptionToggleButton
                label={a.assist.highlightLinksLabel}
                title={a.assist.highlightLinksDesc}
                active={settings.highlightLinks}
                onClick={() => updateSettings({ highlightLinks: !settings.highlightLinks })}
              />
              <OptionToggleButton
                label={a.dyslexia.leftAlignLabel}
                title={a.dyslexia.leftAlignDesc}
                active={settings.leftAlign}
                onClick={() => updateSettings({ leftAlign: !settings.leftAlign })}
              />
              <OptionToggleButton
                label={a.dyslexia.reducedClutterLabel}
                title={a.dyslexia.reducedClutterDesc}
                active={settings.reducedClutter}
                onClick={() => updateSettings({ reducedClutter: !settings.reducedClutter })}
              />
              <OptionToggleButton
                label={a.dyslexia.readingRulerLabel}
                title={a.dyslexia.readingRulerDesc}
                active={settings.readingRuler}
                onClick={() => updateSettings({ readingRuler: !settings.readingRuler })}
              />
            </div>
          </SectionGroup>

          {/* Text Size & Scale */}
          <SectionGroup title={a.textSize.sectionTitle}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground">{a.textSize.bodySizeLabel}</span>
                <span
                  data-testid="a11y-body-size-readout"
                  className="font-mono text-xs font-semibold text-primary tabular-nums"
                >
                  {settings.bodyFontSize}px
                  {settings.bodyFontSize === BODY_FONT_SIZE_DEFAULT ? ` (${a.textSize.defaultTag})` : ""}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={decreaseTextSize}
                  disabled={settings.bodyFontSize <= BODY_FONT_SIZE_MIN}
                  aria-label={`${a.textSize.decreaseBtn} (${a.textSize.bodySizeLabel})`}
                  className="rounded-xl border bg-surface py-2 text-xs font-bold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {a.textSize.decreaseBtn}
                </button>
                <button
                  type="button"
                  onClick={resetTextSize}
                  aria-label={`${a.textSize.defaultBtn} (${a.textSize.defaultTag})`}
                  className={`rounded-xl border py-2 text-xs font-bold transition-colors ${
                    settings.bodyFontSize === BODY_FONT_SIZE_DEFAULT
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-surface text-foreground hover:bg-secondary"
                  }`}
                >
                  {a.textSize.defaultBtn}
                </button>
                <button
                  type="button"
                  onClick={increaseTextSize}
                  disabled={settings.bodyFontSize >= BODY_FONT_SIZE_MAX}
                  aria-label={`${a.textSize.increaseBtn} (${a.textSize.bodySizeLabel})`}
                  className="rounded-xl border bg-surface py-2 text-xs font-bold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {a.textSize.increaseBtn}
                </button>
              </div>

              <input
                id="a11y-body-size-slider"
                type="range"
                min={BODY_FONT_SIZE_MIN}
                max={BODY_FONT_SIZE_MAX}
                step={1}
                value={settings.bodyFontSize}
                aria-label={a.textSize.bodySizeLabel}
                onChange={(e) => updateSettings({ bodyFontSize: Number(e.target.value) })}
                className="h-1.5 w-full cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <CompactSlider
                id="a11y-heading-scale"
                label={a.textSize.headingScaleLabel}
                title={a.textSize.headingScaleDesc}
                valueLabel={`${settings.headingScale}%`}
                min={HEADING_SCALE_MIN}
                max={HEADING_SCALE_MAX}
                step={5}
                value={settings.headingScale}
                onChange={(headingScale) => updateSettings({ headingScale })}
              />
              <CompactSlider
                id="a11y-interface-scale"
                label={a.textSize.interfaceScaleLabel}
                title={a.textSize.interfaceScaleDesc}
                valueLabel={`${settings.interfaceScale}%`}
                min={INTERFACE_SCALE_MIN}
                max={INTERFACE_SCALE_MAX}
                step={5}
                value={settings.interfaceScale}
                onChange={(interfaceScale) => updateSettings({ interfaceScale })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <OptionToggleButton
                label={a.textSize.enlargeControlsLabel}
                title={a.textSize.enlargeControlsDesc}
                active={settings.enlargeControls}
                onClick={() => updateSettings({ enlargeControls: !settings.enlargeControls })}
                fullWidth
              />
            </div>
          </SectionGroup>

          {/* Dark & Light Mode Only */}
          <SectionGroup title={a.color.sectionTitle}>
            <div role="radiogroup" aria-label={a.color.sectionTitle} className="grid grid-cols-2 gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={!isDark}
                onClick={() => updateSettings({ colorMode: "default", customColorsEnabled: false, invertColors: false })}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                  !isDark
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-surface text-foreground hover:bg-secondary"
                }`}
              >
                <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{a.color.modes.light}</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={isDark}
                onClick={() => updateSettings({ colorMode: "dark", customColorsEnabled: false, invertColors: false })}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                  isDark
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-surface text-foreground hover:bg-secondary"
                }`}
              >
                <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{a.color.modes.dark}</span>
              </button>
            </div>
          </SectionGroup>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t px-5 py-3">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {a.resetAll}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.common.close}
          </button>
        </footer>
      </section>
    </div>
  );
}
