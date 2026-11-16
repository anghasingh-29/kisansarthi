import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardCheck,
  FileText,
  Info,
  ListChecks,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { getApplication, statusMeta } from "@/lib/applications";
import { getScheme } from "@/lib/schemes";
import { DemoBadge, CategoryBadge, btn, card } from "@/components/site/Layout";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/status_/$appId")({
  loader: ({ params }) => {
    const app = getApplication(params.appId);
    if (!app) throw notFound();
    return app;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.id} – Application Status – KisanSarthi` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          {
            name: "description",
            content: `Sample details for demo application ${loaderData.id}.`,
          },
          {
            property: "og:title",
            content: `${loaderData.id} – Application Status – KisanSarthi`,
          },
          {
            property: "og:description",
            content: `Sample details for demo application ${loaderData.id}.`,
          },
        ]
      : [
          { title: "Application not found – KisanSarthi" },
          { name: "robots", content: "noindex" },
        ],
  }),
  component: ApplicationDetails,
});

function Timeline({ steps, currentBadge }: { steps: { label: string; state: string }[]; currentBadge: string }) {
  return (
    <ol className="space-y-4">
      {steps.map((s) => {
        const Icon = s.state === "done" ? CheckCircle2 : s.state === "current" ? CircleDot : Circle;
        return (
          <li key={s.label} className="flex items-start gap-3">
            <Icon
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                s.state === "done"
                  ? "text-success"
                  : s.state === "current"
                    ? "text-primary"
                    : "text-muted-foreground/50"
              }`}
            />
            <span
              className={`text-sm ${
                s.state === "current"
                  ? "font-semibold text-primary"
                  : s.state === "todo"
                    ? "text-muted-foreground"
                    : ""
              }`}
            >
              {s.label}
              {s.state === "current" && (
                <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">
                  {currentBadge}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function ApplicationDetails() {
  const a = Route.useLoaderData();
  const scheme = getScheme(a.schemeId);
  const meta = statusMeta[a.status];
  const StatusIcon = meta.icon;
  const { t } = useLanguage();
  const sdp = t.statusDetailPage;
  const tr = t.applicationsData[a.id];
  const schemeTr = scheme ? t.schemesData[scheme.id] : undefined;
  const statusLabel = t.statusPage.statuses[a.status];

  useDocumentTitle(`${a.id} – ${t.statusPage.title} – ${t.brand.full}`);

  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [corrected, setCorrected] = useState(false);

  const toggleStep = (i: number) =>
    setDoneSteps((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const remainingSteps = tr?.remainingSteps ?? a.remainingSteps;
  const nextSteps = tr?.nextSteps ?? a.nextSteps;
  const timelineSteps = a.timeline.map((step, i) => ({
    label: tr?.timeline[i] ?? step.label,
    state: step.state,
  }));
  const schemeName = schemeTr?.name ?? scheme?.name;
  const schemeDocs = schemeTr?.documents ?? scheme?.documents ?? [];

  return (
    <>
      <section className="border-b bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link
            to="/status"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {sdp.backToStatus}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.tone}`}
            >
              <StatusIcon className="h-3.5 w-3.5" /> {statusLabel}
            </span>
            {scheme && <CategoryBadge category={t.categories[scheme.category]} />}
            <DemoBadge>{sdp.demoRecordBadge}</DemoBadge>
          </div>
          <p className="mt-3 font-mono text-sm text-muted-foreground">{a.id}</p>
          <h1 className="mt-1 text-3xl font-bold text-primary md:text-4xl">{schemeName}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {sdp.appliedOnPrefix} {tr?.appliedOn ?? a.appliedOn}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex gap-3 rounded-xl border border-gold/40 bg-gold-soft p-4 text-sm text-gold-foreground">
          <Info className="h-5 w-5 shrink-0" />
          <p className="font-medium">{sdp.demoDisclaimer}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Draft continuation view */}
            {a.status === "draft" && remainingSteps && (
              <section className={card}>
                <h2 className="flex items-center gap-3 text-lg font-semibold">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                    <ListChecks className="h-4 w-4" />
                  </span>
                  {sdp.continueTitle}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{sdp.continueSubtitle}</p>
                <ul className="mt-4 space-y-3">
                  {remainingSteps.map((step, i) => {
                    const done = doneSteps.includes(i);
                    return (
                      <li key={i}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm hover:bg-secondary">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => toggleStep(i)}
                            className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
                          />
                          <span className={done ? "text-muted-foreground line-through" : ""}>
                            {step}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  {sdp.stepsTicked(doneSteps.length, remainingSteps.length)}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/eligibility" className={btn.primary}>
                    <ClipboardCheck className="h-4 w-4" /> {sdp.openEligibility}
                  </Link>
                  <Link to="/checklist" className={btn.outline}>
                    {sdp.documentChecklist}
                  </Link>
                </div>
              </section>
            )}

            {/* Update-needed view */}
            {a.status === "update-needed" && (tr?.flaggedDoc ?? a.flaggedDoc) && (
              <section className={`${card} border-gold/40 bg-gold-soft`}>
                <h2 className="flex items-center gap-3 text-lg font-semibold text-gold-foreground">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-soft ring-1 ring-gold/40">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  {sdp.actionRequired}
                </h2>
                <p className="mt-3 text-sm font-semibold">{tr?.flaggedDoc ?? a.flaggedDoc}</p>
                <p className="mt-1 text-sm text-gold-foreground/90">{tr?.flaggedReason ?? a.flaggedReason}</p>
                {corrected ? (
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" /> {sdp.markedCorrectedDemo}
                  </p>
                ) : (
                  <button onClick={() => setCorrected(true)} className={`${btn.primary} mt-4`}>
                    <RotateCcw className="h-4 w-4" /> {sdp.markCorrectedBtn}
                  </button>
                )}
              </section>
            )}

            {/* Prepared / submitted view */}
            {(a.status === "prepared" || a.status === "submitted") && (
              <section className={card}>
                <h2 className="flex items-center gap-3 text-lg font-semibold">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  {a.status === "prepared" ? sdp.readyForSubmission : sdp.underReview}
                </h2>
                <p className="mt-2 text-sm">{tr?.desc ?? a.desc}</p>
                {nextSteps && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold">{sdp.whatHappensNext}</h3>
                    <ul className="mt-2 space-y-2">
                      {nextSteps.map((n) => (
                        <li key={n} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            )}

            <section className={card}>
              <h2 className="flex items-center gap-3 text-lg font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                  <ListChecks className="h-4 w-4" />
                </span>
                {sdp.progressTimeline}
              </h2>
              <div className="mt-4">
                <Timeline steps={timelineSteps} currentBadge={sdp.currentStepBadge} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className={card}>
              <h2 className="flex items-center gap-3 text-lg font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                {sdp.applicationSummary}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{sdp.referenceLabel}</dt>
                  <dd className="font-mono">{a.id}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{sdp.statusLabel}</dt>
                  <dd className="font-semibold">{statusLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{sdp.appliedOnLabel}</dt>
                  <dd>{tr?.appliedOn ?? a.appliedOn}</dd>
                </div>
                {schemeName && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{sdp.schemeLabel}</dt>
                    <dd className="text-right font-medium">{schemeName}</dd>
                  </div>
                )}
              </dl>
              {scheme && (
                <Link to="/schemes/$id" params={{ id: scheme.id }} className={`${btn.outline} mt-5 w-full`}>
                  {sdp.viewSchemeDetails}
                </Link>
              )}
            </section>

            {scheme && (
              <section className={card}>
                <h2 className="text-lg font-semibold">{sdp.documentsForApp}</h2>
                <ul className="mt-4 space-y-2">
                  {schemeDocs.map((d) => (
                    <li key={d} className="flex gap-2 text-sm text-muted-foreground">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {d}
                    </li>
                  ))}
                </ul>
                <Link to="/checklist" className={`${btn.outline} mt-5 w-full`}>
                  {sdp.openDocumentChecklist}
                </Link>
              </section>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
