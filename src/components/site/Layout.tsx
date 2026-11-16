import { Link } from "@tanstack/react-router";
import { Leaf, Menu, X, Info, Languages } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useLanguage, type Language } from "@/lib/i18n";

export function Logo() {
  const { t } = useLanguage();
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-primary">
        {t.brand.first}
        <span className="text-gold-foreground">{t.brand.second}</span>
      </span>
    </Link>
  );
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();
  const options: { value: Language; label: string }[] = [
    { value: "en", label: t.nav.englishOption },
    { value: "hi", label: t.nav.hindiOption },
  ];
  return (
    <div
      role="group"
      aria-label={t.nav.languageLabel}
      className={`inline-flex items-center rounded-xl border bg-surface p-0.5 ${compact ? "text-xs" : "text-sm"}`}
    >
      <Languages className="mx-1.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLang(opt.value)}
          aria-pressed={lang === opt.value}
          className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
            lang === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t, showFirstVisitPrompt, dismissFirstVisitPrompt } = useLanguage();
  const nav = [
    { to: "/", label: t.nav.home },
    { to: "/schemes", label: t.nav.schemes },
    { to: "/eligibility", label: t.nav.eligibility },
    { to: "/checklist", label: t.nav.checklist },
    { to: "/status", label: t.nav.status },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {showFirstVisitPrompt && (
        <div className="border-b bg-secondary px-4 py-2 text-sm">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Languages className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-semibold text-primary">{t.nav.firstVisitTitle}:</span>
              <span className="text-muted-foreground">{t.nav.firstVisitText}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => dismissFirstVisitPrompt("en")}
                className="rounded-lg border border-primary/30 bg-background px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {t.nav.englishOption}
              </button>
              <button
                type="button"
                onClick={() => dismissFirstVisitPrompt("hi")}
                className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t.nav.hindiOption}
              </button>
              <button
                type="button"
                onClick={() => dismissFirstVisitPrompt()}
                aria-label={t.nav.dismissBanner}
                className="rounded-lg p-1 text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2">
        <Logo />
        <nav className="hidden flex-wrap items-center gap-1 lg:flex" aria-label="Main navigation">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary/80 hover:text-primary"
              activeProps={{ className: "bg-secondary text-primary font-semibold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden">
            <LanguageSwitcher compact />
          </div>
          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={t.nav.toggleMenu}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-2 lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();
  const nav = [
    { to: "/schemes", label: t.nav.schemes },
    { to: "/eligibility", label: t.nav.eligibility },
    { to: "/checklist", label: t.nav.checklist },
    { to: "/status", label: t.nav.status },
  ] as const;

  return (
    <footer className="mt-16 border-t bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.quickLinks}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gold/40 bg-gold-soft p-4 text-sm text-gold-foreground">
          <p className="flex items-center gap-2 font-semibold">
            <Info className="h-4 w-4" /> {t.footer.demoNoticeTitle}
          </p>
          <p className="mt-1">{t.footer.demoNoticeText}</p>
        </div>
      </div>
      <p className="border-t py-4 text-center text-xs text-muted-foreground">{t.footer.copyright}</p>
    </footer>
  );
}

export function PageHeader({
  title,
  subtitle,
  aside,
  children,
}: {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b bg-gradient-to-b from-secondary via-secondary/65 to-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary text-balance md:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground md:text-lg">{subtitle}</p>}
          {children}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </section>
  );
}

export function DemoBadge({ children }: { children?: ReactNode }) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gold-foreground">
      <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children ?? t.common.demoInfo}</span>
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center text-xs font-semibold tracking-wide text-primary/80">
      {category}
    </span>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-all duration-150 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
  outline:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-primary/30 bg-background px-5 py-3 text-sm font-semibold text-primary transition-all duration-150 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
};
export const card = "rounded-2xl border bg-card p-6 shadow-card";
