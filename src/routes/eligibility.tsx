import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ClipboardCheck } from "lucide-react";
import { PageHeader, btn, card } from "@/components/site/Layout";
import { SitePhoto } from "@/components/site/SitePhoto";
import { evaluateEligibility, type EligibilityInput } from "@/lib/schemes";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Check Your Eligibility – KisanSarthi" },
      { name: "description", content: "Answer five simple questions to see a sample eligibility result." },
      { property: "og:title", content: "Check Your Eligibility – KisanSarthi" },
      { property: "og:description", content: "A simple sample eligibility checker for farmers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checker,
});

const states = ["Andhra Pradesh", "Bihar", "Gujarat", "Haryana", "Karnataka", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"];
const empty: EligibilityInput = { state: "", category: "", land: "", crop: "", documents: "" };

function Checker() {
  const [v, setV] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  useDocumentTitle(t.meta.eligibilityTitle);

  const err = (k: keyof EligibilityInput) => submitted && !v[k];
  const ep = t.eligibilityPage;

  const fields: { key: keyof EligibilityInput; label: string; help: string; options: [string, string][] }[] = [
    { key: "state", label: ep.fields.state.label, help: ep.fields.state.help, options: states.map((s) => [s, ep.states[s] ?? s]) },
    {
      key: "category",
      label: ep.fields.category.label,
      help: ep.fields.category.help,
      options: [
        ["small", ep.fields.category.options.small],
        ["marginal", ep.fields.category.options.marginal],
        ["other", ep.fields.category.options.other],
      ],
    },
    {
      key: "land",
      label: ep.fields.land.label,
      help: ep.fields.land.help,
      options: [
        ["below-1", ep.fields.land.options["below-1"]],
        ["1-2", ep.fields.land.options["1-2"]],
        ["2-5", ep.fields.land.options["2-5"]],
        ["above-5", ep.fields.land.options["above-5"]],
      ],
    },
    {
      key: "crop",
      label: ep.fields.crop.label,
      help: ep.fields.crop.help,
      options: [
        ["cereals", ep.fields.crop.options.cereals],
        ["pulses", ep.fields.crop.options.pulses],
        ["oilseeds", ep.fields.crop.options.oilseeds],
        ["horticulture", ep.fields.crop.options.horticulture],
        ["cash", ep.fields.crop.options.cash],
      ],
    },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(v).some((x) => !x)) return;
    navigate({ to: "/result", search: { status: evaluateEligibility(v), category: v.category, land: v.land, documents: v.documents } });
  };

  return (
    <>
      <PageHeader title={ep.title} subtitle={ep.subtitle} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <form onSubmit={submit} noValidate className={`${card} space-y-6 lg:col-span-2`}>
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className="block text-sm font-semibold">{f.label} <span className="text-destructive">*</span></label>
              <select
                id={f.key}
                value={v[f.key]}
                onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
                aria-invalid={err(f.key)}
                className={`mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:ring-2 focus:ring-ring ${err(f.key) ? "border-destructive" : ""}`}
              >
                <option value="">{ep.selectPlaceholder}</option>
                {f.options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
              </select>
              <p className={`mt-1.5 text-xs ${err(f.key) ? "text-destructive" : "text-muted-foreground"}`}>{err(f.key) ? ep.requiredError : f.help}</p>
            </div>
          ))}
          <fieldset>
            <legend className="text-sm font-semibold">{ep.requiredDocsLegend} <span className="text-destructive">*</span></legend>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {([["yes", ep.docOptions.yes], ["no", ep.docOptions.no], ["not-sure", ep.docOptions["not-sure"]]] as const).map(([val, l]) => (
                <label key={val} className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${v.documents === val ? "border-primary bg-secondary text-primary" : "hover:border-primary/40"} ${err("documents") ? "border-destructive" : ""}`}>
                  <input type="radio" name="documents" value={val} checked={v.documents === val} onChange={() => setV({ ...v, documents: val })} className="accent-primary" />
                  {l}
                </label>
              ))}
            </div>
            <p className={`mt-1.5 text-xs ${err("documents") ? "text-destructive" : "text-muted-foreground"}`}>{err("documents") ? ep.requiredError : ep.requiredDocsHelp}</p>
          </fieldset>
          <button type="submit" className={`${btn.primary} w-full sm:w-auto`}><ClipboardCheck className="h-4 w-4" /> {ep.submitButton}</button>
        </form>
        <aside className="space-y-5">
          <SitePhoto
            src="/assets/aistudio/image_dd86373a.png"
            alt={t.home.heroImageAlt}
            captionTitle={t.home.heroCaptionTitle}
            fallbackLabel={ep.title}
            className="aspect-[4/3] w-full shadow-card"
            imgClassName="object-top"
          />
          <div className={`${card} bg-secondary`}>
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-semibold">{ep.privacyTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{ep.privacyText}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
