import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Info } from "lucide-react";
import { PageHeader, btn, card } from "@/components/site/Layout";
import { applications, statusMeta } from "@/lib/applications";
import { getScheme } from "@/lib/schemes";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Application Status – KisanSarthi" },
      { name: "description", content: "View the progress of sample scheme applications." },
      { property: "og:title", content: "Application Status – KisanSarthi" },
      { property: "og:description", content: "Track sample application progress on KisanSarthi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Status,
});

function Status() {
  const { t } = useLanguage();
  useDocumentTitle(t.meta.statusTitle);
  const sp = t.statusPage;

  return (
    <>
      <PageHeader title={sp.title} subtitle={sp.subtitle} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-3 rounded-xl border border-gold/40 bg-gold-soft p-4 text-sm text-gold-foreground">
          <Info className="h-5 w-5 shrink-0" />
          <p className="font-medium">{sp.demoBanner}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {applications.map((a) => {
            const meta = statusMeta[a.status];
            const Icon = meta.icon;
            const tr = t.applicationsData[a.id];
            const scheme = getScheme(a.schemeId);
            const schemeName = t.schemesData[a.schemeId]?.name ?? scheme?.name ?? a.schemeId;
            return (
              <article key={a.id} className={`${card} flex flex-col`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{a.id}</p>
                    <h3 className="mt-1 text-lg font-semibold">{schemeName}</h3>
                  </div>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.tone}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {sp.statuses[a.status]}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" /> {sp.appliedOnPrefix} {tr?.appliedOn ?? a.appliedOn}
                </p>
                <p className="mt-3 flex-1 text-sm">{tr?.desc ?? a.desc}</p>
                <Link
                  to="/status/$appId"
                  params={{ appId: a.id }}
                  className={`${a.status === "draft" ? btn.primary : btn.outline} mt-5 w-full sm:w-auto sm:self-start`}
                >
                  {sp.actions[a.status]}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
