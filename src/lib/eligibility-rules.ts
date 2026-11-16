import type { ResultStatus } from "@/lib/schemes";
import { translations, type Language } from "@/lib/i18n";

export interface EligibilityAnswers {
  category?: string | undefined;
  land?: string | undefined;
  documents?: string | undefined;
}

export interface EligibilityRule {
  id: "category" | "land" | "documents";
  label: string;
  detail: string;
  /** The farmer's own answer, in friendly words. Undefined when not answered. */
  answer?: string | undefined;
  /** Whether the answer meets the sample rule. Undefined when not answered. */
  passed?: boolean | undefined;
}

/** The three sample rules the demo checker compares answers against. */
export function eligibilityRules(a: EligibilityAnswers, lang: Language = "en"): EligibilityRule[] {
  const { rules, answerLabels } = translations[lang].resultPage;
  return [
    {
      id: "category",
      label: rules.category.label,
      detail: rules.category.detail,
      answer: a.category ? (answerLabels.category[a.category] ?? a.category) : undefined,
      passed: a.category ? a.category === "small" || a.category === "marginal" : undefined,
    },
    {
      id: "land",
      label: rules.land.label,
      detail: rules.land.detail,
      answer: a.land ? (answerLabels.land[a.land] ?? a.land) : undefined,
      passed: a.land ? a.land !== "above-5" : undefined,
    },
    {
      id: "documents",
      label: rules.documents.label,
      detail: rules.documents.detail,
      answer: a.documents ? (answerLabels.documents[a.documents] ?? a.documents) : undefined,
      passed: a.documents ? a.documents === "yes" : undefined,
    },
  ];
}

/** Plain-language explanation of why the checker reached this sample outcome. */
export const outcomeExplanations: Record<ResultStatus, string> = {
  match: translations.en.resultPage.outcomes.match.explanation,
  "more-info": translations.en.resultPage.outcomes["more-info"].explanation,
  insufficient: translations.en.resultPage.outcomes.insufficient.explanation,
};
