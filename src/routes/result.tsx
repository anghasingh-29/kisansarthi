import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, HelpCircle, Info, RotateCcw, Search, XCircle, ListChecks } from "lucide-react";
import { z } from "zod";
import { btn, card } from "@/components/site/Layout";
import { eligibilityRules, type EligibilityAnswers } from "@/lib/eligibility-rules";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

const searchSchema = z.object({
  status: z.enum(["match", "more-info", "insufficient"]).catch("insufficient"),
  category: z.string().catch(""),
  land: z.string().catch(""),
  documents: z.string().catch(""),
});

export const Route = createFileRoute("/result")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Eligibility Result – KisanSarthi" },
      { name: "description", content: "Your sample eligibility result with the sample rules explained and next steps." },
      { property: "og:title", content: "Eligibility Result – KisanSarthi" },
      { property: "og:description", content: "Demonstration eligibility result with sample rules explained." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Result,
});

const resultStyles = {
  match: {
    icon: CheckCircle2,
    tone: "bg-success-soft text-success border-success/30",
    iconTone: "bg-success text-primary-foreground",
  },
  "more-info": {
    icon: AlertCircle,
    tone: "bg-gold-soft text-gold-foreground border-gold/40",
    iconTone: "bg-gold text-foreground",
  },
  insufficient: {
    icon: HelpCircle,
    tone: "bg-neutral-soft text-muted-foreground border-border",
    iconTone: "bg-muted-foreground text-primary-foreground",
  },
} as const;

function Result() {
  const { status, category, land, documents } = Route.useSearch();
  const { t } = useLanguage();
  useDocumentTitle(t.meta.resultTitle);
  const answered = Boolean(category || land || documents);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <span className="text-muted-foreground">{t.resultPage.previewLabel}</span>
        {(Object.keys(resultStyles) as (keyof typeof resultStyles)[]).map((k) => (
          <Link key={k} to="/result" search={{ status: k, category: "", land: "", documents: "" }} className={`rounded-full border px-3 py-1 ${status === k ? "border-primary bg-secondary text-primary" : "text-muted-foreground"}`}>{t.resultPage.outcomes[k].title}</Link>
        ))}
      </div>
      <ResultCard status={status} answers={{ category: category || undefined, land: land || undefined, documents: documents || undefined }} answered={answered} />
    </div>
  );
}

function ResultCard({ status, answers, answered }: { status: keyof typeof resultStyles; answers: EligibilityAnswers; answered: boolean }) {
  const { lang, t } = useLanguage();
  const rp = t.resultPage;
  const r = rp.outcomes[status];
  const style = resultStyles[status];
  const Icon = style.icon;
  const rules = eligibilityRules(answers, lang);

  return (
    <div className={`${card} mx-auto max-w-3xl p-0 overflow-hidden`}>
      <div className={`flex flex-col items-center gap-3 border-b p-8 text-center ${style.tone}`}>
        <span className={`grid h-16 w-16 place-items-center rounded-full ${style.iconTone}`}><Icon className="h-8 w-8" /></span>
        <h1 className="text-2xl font-bold md:text-3xl">{r.title}</h1>
        <p className="max-w-lg text-sm text-foreground/80">{r.text}</p>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div>
          <h2 className="font-semibold">{rp.whyResult}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{r.reasons.map((x) => <li key={x} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{x}</li>)}</ul>
        </div>
        <div>
          <h2 className="font-semibold">{rp.nextSteps}</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">{r.steps.map((x, i) => <li key={x} className="flex gap-2"><span className="font-semibold text-primary">{i + 1}.</span>{x}</li>)}</ol>
        </div>
      </div>
      <section className="mx-6 mb-6 rounded-xl border bg-surface p-5 md:mx-8">
        <h2 className="flex items-center gap-2 font-semibold"><ListChecks className="h-5 w-5 text-primary" /> {rp.rulesHeading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{rp.rulesIntro}</p>
        <ul className="mt-4 space-y-4">
          {rules.map((rule) => (
            <li key={rule.id} className="flex gap-3">
              <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${rule.passed === true ? "bg-success-soft text-success" : rule.passed === false ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                {rule.passed === true ? <CheckCircle2 className="h-4 w-4" /> : rule.passed === false ? <XCircle className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
              </span>
              <div>
                <p className="text-sm font-medium">{rule.label}</p>
                <p className="text-xs text-muted-foreground">{rule.detail}</p>
                {rule.answer ? (
                  <p className="mt-0.5 text-xs">{rp.yourAnswer} <span className={`font-semibold ${rule.passed === false ? "text-destructive" : "text-foreground"}`}>{rule.answer}</span></p>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">{rp.notAnswered}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t pt-3 text-sm text-foreground/90">{r.explanation}</p>
        {!answered && <p className="mt-1 text-xs text-muted-foreground">{rp.designPreviewNote}</p>}
      </section>
      <div className="mx-6 mb-6 flex gap-3 rounded-xl border border-gold/40 bg-gold-soft p-4 text-sm text-gold-foreground md:mx-8">
        <Info className="h-5 w-5 shrink-0" />
        <p className="font-medium">{rp.disclaimer}</p>
      </div>
      <div className="flex flex-col gap-3 border-t bg-surface p-6 sm:flex-row sm:justify-end md:px-8">
        <Link to="/eligibility" className={btn.outline}><RotateCcw className="h-4 w-4" /> {rp.checkAgain}</Link>
        <Link to="/schemes" className={btn.primary}><Search className="h-4 w-4" /> {rp.exploreOther}</Link>
      </div>
    </div>
  );
}
