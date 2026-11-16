import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Users, ArrowRight, Sprout, Banknote, Droplets, Tractor, ShieldCheck } from "lucide-react";
import { schemes, categories, type Category } from "@/lib/schemes";
import { PageHeader, DemoBadge, CategoryBadge, btn, card } from "@/components/site/Layout";
import { SitePhoto } from "@/components/site/SitePhoto";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/schemes/")({
  head: () => ({
    meta: [
      { title: "Explore Government Schemes – KisanSarthi" },
      { name: "description", content: "Find sample government schemes that match your farming needs." },
      { property: "og:title", content: "Explore Government Schemes – KisanSarthi" },
      { property: "og:description", content: "Search and filter sample farmer schemes by category." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explorer,
});

export const categoryIcon: Record<Category, typeof Sprout> = {
  "Financial Support": Banknote,
  Agriculture: Sprout,
  Irrigation: Droplets,
  Equipment: Tractor,
  Insurance: ShieldCheck,
};

function Explorer() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All Schemes");
  const { t } = useLanguage();
  useDocumentTitle(t.meta.schemesTitle);

  const query = q.toLowerCase();
  const list = schemes.filter((s) => {
    const tr = t.schemesData[s.id];
    const haystack = `${s.name} ${s.short} ${tr?.name ?? ""} ${tr?.short ?? ""}`.toLowerCase();
    return (cat === "All Schemes" || s.category === cat) && haystack.includes(query);
  });

  return (
    <>
      <PageHeader
        title={t.schemesPage.title}
        subtitle={t.schemesPage.subtitle}
        aside={
          <SitePhoto
            src="/assets/aistudio/image_cf798dc4.png"
            alt={t.home.showcaseImageAlt}
            captionTitle={t.home.showcaseCaptionTitle}
            fallbackLabel={t.schemesPage.title}
            className="hidden h-44 w-72 shadow-card lg:block"
            imgClassName="scale-[1.14] object-[center_35%] group-hover:scale-[1.17]"
          />
        }
      >
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.schemesPage.searchPlaceholder}
            aria-label={t.schemesPage.searchAriaLabel}
            className="h-12 w-full rounded-xl border bg-background pl-12 pr-4 shadow-card outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 rounded-xl bg-surface p-1.5 ring-1 ring-border">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${cat === c ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background hover:text-primary"}`}
              >
                {t.categories[c]}
              </button>
            ))}
          </div>
          <DemoBadge>{t.schemesPage.demoBadge}</DemoBadge>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => {
            const Icon = categoryIcon[s.category];
            const tr = t.schemesData[s.id];
            return (
              <article key={s.id} className={`${card} flex flex-col`}>
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
                  <CategoryBadge category={t.categories[s.category]} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{tr?.name ?? s.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{tr?.short ?? s.short}</p>
                <p className="mt-4 flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm"><Users className="h-4 w-4 text-primary" /> <span className="text-muted-foreground">{t.schemesPage.whoCanBenefit}</span> <span className="font-medium">{tr?.beneficiaries ?? s.beneficiaries}</span></p>
                <Link to="/schemes/$id" params={{ id: s.id }} className={`${btn.primary} mt-4 w-full`}>{t.schemesPage.viewDetails} <ArrowRight className="h-4 w-4" /></Link>
              </article>
            );
          })}
          {list.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">{t.schemesPage.emptyState}</p>}
        </div>
      </div>
    </>
  );
}
