import { describe, expect, it } from "vitest";

import { eligibilityRules, type EligibilityRule } from "@/lib/eligibility-rules";
import { evaluateEligibility } from "@/lib/schemes";

// The result page explains the three sample rules; these tests pin what each
// rule reports for representative answers, and that they agree with the
// demo checker's outcome.
const ruleResults = (answers: Parameters<typeof eligibilityRules>[0]): Record<EligibilityRule["id"], boolean | undefined> =>
  Object.fromEntries(eligibilityRules(answers).map((r) => [r.id, r.passed])) as Record<
    EligibilityRule["id"],
    boolean | undefined
  >;

describe("Sample eligibility rules shown on the result page", () => {
  it("a small farmer with 1-2 hectares and documents ready passes all three rules", () => {
    expect(ruleResults({ category: "small", land: "1-2", documents: "yes" })).toEqual({
      category: true,
      land: true,
      documents: true,
    });
  });

  it("more than 5 hectares fails the landholding rule", () => {
    expect(ruleResults({ category: "marginal", land: "above-5", documents: "yes" }).land).toBe(false);
  });

  it("the 'Other' farmer category fails the category rule", () => {
    expect(ruleResults({ category: "other", land: "1-2", documents: "yes" }).category).toBe(false);
  });

  it("documents marked 'no' fail the documents rule", () => {
    expect(ruleResults({ category: "small", land: "1-2", documents: "no" }).documents).toBe(false);
  });

  it("unanswered questions show no pass or fail", () => {
    expect(ruleResults({})).toEqual({ category: undefined, land: undefined, documents: undefined });
  });

  it("the rules agree with the demo checker's 'match' outcome", () => {
    expect(
      evaluateEligibility({ state: "Bihar", category: "small", land: "1-2", crop: "cereals", documents: "yes" }),
    ).toBe("match");
  });
});
