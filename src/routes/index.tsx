import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ClipboardCheck, FileText, Activity, ArrowRight } from "lucide-react";
import { btn, DemoBadge } from "@/components/site/Layout";
import { SitePhoto } from "@/components/site/SitePhoto";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanSarthi – Schemes & Eligibility for Farmers" },
      {
        name: "description",
        content: "Explore sample government schemes, check eligibility, prepare documents and track applications.",
      },
      { property: "og:title", content: "KisanSarthi – Schemes & Eligibility for Farmers" },
      { property: "og:description", content: "A simple portal to explore farmer schemes and check sample eligibility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLanguage();
  useDocumentTitle(t.meta.homeTitle);

  const features = [
    {
      number: "01",
      to: "/schemes",
      icon: Search,
      title: t.home.features.schemes.title,
      text: t.home.features.schemes.text,
    },
    {
      number: "02",
      to: "/eligibility",
      icon: ClipboardCheck,
      title: t.home.features.eligibility.title,
      text: t.home.features.eligibility.text,
    },
    {
      number: "03",
      to: "/checklist",
      icon: FileText,
      title: t.home.features.checklist.title,
      text: t.home.features.checklist.text,
    },
    {
      number: "04",
      to: "/status",
      icon: Activity,
      title: t.home.features.status.title,
      text: t.home.features.status.text,
    },
  ] as const;

  return (
    <>
      <section className="border-b bg-gradient-to-b from-secondary via-secondary/60 to-background">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-12 md:py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="flex flex-col justify-center lg:col-span-6">
            <DemoBadge>{t.home.badge}</DemoBadge>
            <h1 className="font-display mt-3 max-w-xl text-4xl font-bold leading-[1.15] tracking-tight text-primary text-balance md:text-5xl">
              {t.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/schemes" className={btn.primary}>
                {t.home.exploreCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/eligibility" className={btn.outline}>
                {t.home.eligibilityCta}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-primary/15 pt-5 text-xs font-medium text-muted-foreground tabular-nums sm:text-sm">
              {t.home.summaryItems.map((item, idx) => (
                <span key={item} className="inline-flex items-center gap-3">
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-primary/40">
                      ·
                    </span>
                  )}
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <SitePhoto
              src="/assets/aistudio/image_dd86373a.png"
              alt={t.home.heroImageAlt}
              captionTitle={t.home.heroCaptionTitle}
              captionText={t.home.heroCaptionText}
              fallbackLabel={t.home.heroCaptionTitle}
              className="aspect-[4/3] w-full shadow-card lg:aspect-auto lg:h-full lg:min-h-[420px]"
              imgClassName="object-top"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-14">
        <div className="mb-7 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-primary text-balance">
              {t.home.toolsHeading}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.home.toolsSubheading}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group flex flex-col rounded-2xl border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-medium text-muted-foreground tabular-nums">{f.number}</span>
              </div>
              <h3 className="mt-5 font-semibold text-foreground group-hover:text-primary">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-surface/70">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <SitePhoto
              src="/assets/aistudio/image_cf798dc4.png"
              alt={t.home.showcaseImageAlt}
              captionTitle={t.home.showcaseCaptionTitle}
              captionText={t.home.showcaseCaptionText}
              fallbackLabel={t.home.showcaseCaptionTitle}
              className="aspect-[4/3] w-full shadow-card lg:aspect-auto lg:h-full lg:min-h-[400px]"
              imgClassName="scale-[1.14] object-[center_35%] group-hover:scale-[1.17]"
            />
          </div>

          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gold-foreground">{t.home.showcaseEyebrow}</p>
              <h2 className="font-display mt-2 text-2xl font-bold leading-snug tracking-tight text-primary text-balance md:text-3xl">
                {t.home.showcaseTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {t.home.showcaseSubtitle}
              </p>

              <ol className="mt-6 divide-y border-y">
                {t.home.showcaseSteps.map((step) => (
                  <li key={step.number} className="flex gap-4 py-4">
                    <span className="font-mono pt-0.5 text-xs font-semibold text-primary tabular-nums">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6">
              <Link to="/checklist" className={btn.outline}>
                {t.home.showcaseCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
