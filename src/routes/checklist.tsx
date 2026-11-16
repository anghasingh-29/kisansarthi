import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, RotateCcw, Check } from "lucide-react";
import { PageHeader, DemoBadge, btn, card } from "@/components/site/Layout";
import { DocumentUploads } from "@/components/site/DocumentUploads";
import { useDocumentTitle, useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Your Document Checklist – KisanSarthi" },
      { name: "description", content: "Prepare your scheme documents and privately upload PDF files and photos with KisanSarthi." },
      { property: "og:title", content: "Your Document Checklist – KisanSarthi" },
      { property: "og:description", content: "Track document readiness for sample farmer schemes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checklist,
});

function Checklist() {
  const [done, setDone] = useState<boolean[]>([true, true, false, false, false]);
  const { t } = useLanguage();
  useDocumentTitle(t.meta.checklistTitle);
  const cp = t.checklistPage;
  const count = done.filter(Boolean).length;
  const pct = Math.round((count / cp.docs.length) * 100);
  const schemeName = t.schemesData["harit-kisan-sahayata"]?.name ?? "Harit Kisan Sahayata Yojana";

  return (
    <>
      <PageHeader title={cp.title} subtitle={cp.subtitle} />
      <DocumentUploads />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className={`${card} lg:col-span-2`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{cp.selectedScheme}</p>
              <h2 className="text-lg font-semibold text-primary">{schemeName}</h2>
            </div>
            <DemoBadge>{cp.sampleSchemeBadge}</DemoBadge>
          </div>
          <ul className="mt-6 space-y-3">
            {cp.docs.map((d, i) => (
              <li key={i}>
                <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${done[i] ? "border-primary/40 bg-secondary" : "hover:border-primary/30"}`}>
                  <input type="checkbox" className="sr-only" checked={done[i]} onChange={() => setDone(done.map((x, j) => (j === i ? !x : x)))} />
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${done[i] ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{done[i] && <Check className="h-4 w-4" />}</span>
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className={`block font-medium ${done[i] ? "text-primary" : ""}`}>{d.name}</span>
                    <span className="block text-xs text-muted-foreground">{d.note}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <aside className={`${card} h-fit`}>
          <p className="text-sm text-muted-foreground">{cp.progressLabel}</p>
          <p className="mt-1 text-4xl font-bold text-primary">{pct}%</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-sm font-medium">{cp.completedSummary(count, cp.docs.length)}</p>
          <button onClick={() => setDone(cp.docs.map(() => false))} className={`${btn.outline} mt-6 w-full`}><RotateCcw className="h-4 w-4" /> {cp.resetButton}</button>
        </aside>
      </div>
    </>
  );
}
