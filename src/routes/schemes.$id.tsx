import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Users, Gift, FileText, ListOrdered, CheckCircle2, ClipboardCheck } from "lucide-react";
import { getScheme } from "@/lib/schemes";
import { DemoBadge, CategoryBadge, btn, card } from "@/components/site/Layout";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";
import type { ReactNode } from "react";

export const Route = createFileRoute("/schemes/$id")({
  loader: ({ params }) => {
    const scheme = getScheme(params.id);
    if (!scheme) throw notFound();
    return scheme;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} – KisanSarthi` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} – KisanSarthi` },
          { property: "og:description", content: loaderData.short },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Scheme not found – KisanSarthi" }, { name: "robots", content: "noindex" }],
  }),
  component: Details,
});

function Section({ icon: Icon, title, children }: { icon: typeof Users; title: string; children: ReactNode }) {
  return (
    <section className={card}>
      <h2 className="flex items-center gap-3 text-lg font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>
      ))}
    </ul>
  );
}

function Details() {
  const s = Route.useLoaderData();
  const { t } = useLanguage();
  const tr = t.schemesData[s.id];
  const name = tr?.name ?? s.name;
  useDocumentTitle(`${name} – ${t.brand.full}`);

  return (
    <>
      <section className="border-b bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link to="/schemes" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> {t.schemeDetailPage.backToSchemes}</Link>
          <div className="mt-4 flex flex-wrap items-center gap-2"><CategoryBadge category={t.categories[s.category]} /><DemoBadge /></div>
          <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{name}</h1>
          <p className="mt-2 text-muted-foreground">{tr?.short ?? s.short}</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section icon={BookOpen} title={t.schemeDetailPage.overview}><p className="text-sm leading-relaxed text-muted-foreground">{tr?.overview ?? s.overview}</p></Section>
          <div className="grid gap-6 md:grid-cols-2">
            <Section icon={Users} title={t.schemeDetailPage.whoCanBenefit}><Bullets items={tr?.whoCanBenefit ?? s.whoCanBenefit} /></Section>
            <Section icon={Gift} title={t.schemeDetailPage.sampleBenefits}><Bullets items={tr?.benefits ?? s.benefits} /></Section>
          </div>
          <Section icon={ListOrdered} title={t.schemeDetailPage.howToApply}>
            <ol className="space-y-4">
              {(tr?.steps ?? s.steps).map((st, i) => (
                <li key={st} className="flex items-center gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="text-sm">{st}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
        <aside className="space-y-6">
          <Section icon={FileText} title={t.schemeDetailPage.requiredDocuments}><Bullets items={tr?.documents ?? s.documents} /></Section>
          <div className={`${card} border-gold/40 bg-gold-soft`}>
            <h3 className="font-semibold">{t.schemeDetailPage.readyToCheck}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.schemeDetailPage.readyToCheckText}</p>
            <Link to="/eligibility" className={`${btn.primary} mt-4 w-full`}><ClipboardCheck className="h-4 w-4" /> {t.schemeDetailPage.checkEligibility}</Link>
            <Link to="/checklist" className={`${btn.outline} mt-2 w-full`}>{t.schemeDetailPage.documentChecklist}</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
