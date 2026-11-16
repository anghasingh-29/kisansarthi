import { FilePen, FileCheck2, Send, AlertTriangle } from "lucide-react";
import { translations, type Language } from "@/lib/i18n";

export type AppStatus = "draft" | "prepared" | "submitted" | "update-needed";

export interface TimelineStep {
  label: string;
  state: "done" | "current" | "todo";
}

export interface DemoApplication {
  id: string;
  schemeId: string;
  appliedOn: string;
  status: AppStatus;
  desc: string;
  timeline: TimelineStep[];
  /** Draft continuation view: steps still to complete before submission. */
  remainingSteps?: string[];
  /** Update-needed view: the document that must be corrected. */
  flaggedDoc?: string;
  flaggedReason?: string;
  nextSteps?: string[];
}

export const statusMeta: Record<
  AppStatus,
  { label: string; tone: string; icon: typeof FilePen }
> = {
  draft: {
    label: "Draft",
    tone: "bg-neutral-soft text-muted-foreground",
    icon: FilePen,
  },
  prepared: {
    label: "Prepared",
    tone: "bg-secondary text-primary",
    icon: FileCheck2,
  },
  submitted: {
    label: "Submitted (Demo)",
    tone: "bg-success-soft text-success",
    icon: Send,
  },
  "update-needed": {
    label: "Update Needed",
    tone: "bg-gold-soft text-gold-foreground",
    icon: AlertTriangle,
  },
};

export const applications: DemoApplication[] = [
  {
    id: "KS-DEMO-0001",
    schemeId: "harit-kisan-sahayata",
    appliedOn: "01 Jan 2099 (Demo)",
    status: "draft",
    desc: "Your application is saved but not yet complete.",
    timeline: [
      { label: "Application started", state: "done" },
      { label: "Complete your details and documents", state: "current" },
      { label: "Submit for review", state: "todo" },
    ],
    remainingSteps: [
      "Fill in farmer and land details",
      "Confirm bank account information",
      "Attach a copy of the land ownership record",
      "Review everything and submit",
    ],
  },
  {
    id: "KS-DEMO-0002",
    schemeId: "jal-bindu-sinchai",
    appliedOn: "15 Feb 2099 (Demo)",
    status: "prepared",
    desc: "All details and documents are ready for submission.",
    timeline: [
      { label: "Application started", state: "done" },
      { label: "Details completed", state: "done" },
      { label: "Documents attached", state: "done" },
      { label: "Ready to submit", state: "current" },
      { label: "Review and verification", state: "todo" },
    ],
    nextSteps: [
      "Submit the application at your nearest service centre",
      "A field officer may visit to verify the land",
      "After approval, the vendor installs the system and the subsidy is released",
    ],
  },
  {
    id: "KS-DEMO-0003",
    schemeId: "fasal-suraksha-kavach",
    appliedOn: "10 Mar 2099 (Demo)",
    status: "submitted",
    desc: "Your sample application has been submitted for review.",
    timeline: [
      { label: "Application started", state: "done" },
      { label: "Details completed", state: "done" },
      { label: "Documents attached", state: "done" },
      { label: "Submitted for review", state: "done" },
      { label: "Under review by the department", state: "current" },
      { label: "Decision and enrolment confirmation", state: "todo" },
    ],
    nextSteps: [
      "The department checks your crop and land details",
      "You will receive a confirmation once enrolment is approved",
      "Report any crop loss within 72 hours after the approval",
    ],
  },
  {
    id: "KS-DEMO-0004",
    schemeId: "yantra-mitra",
    appliedOn: "22 Apr 2099 (Demo)",
    status: "update-needed",
    desc: "A document needs to be re-uploaded or corrected.",
    timeline: [
      { label: "Application started", state: "done" },
      { label: "Details completed", state: "done" },
      { label: "Documents attached", state: "done" },
      { label: "Submitted for review", state: "done" },
      { label: "Fix the flagged document", state: "current" },
      { label: "Re-submission and review", state: "todo" },
    ],
    flaggedDoc: "Equipment quotation letter",
    flaggedReason:
      "The uploaded copy is not readable. Please upload a clear scan of the quotation letter issued by the approved vendor.",
    nextSteps: [
      "Correct or re-upload the flagged document",
      "The application goes back to the review queue",
      "You receive the approval letter once the review is complete",
    ],
  },
];

export const getApplication = (id: string) =>
  applications.find((a) => a.id === id);

export function localizeApplication(app: DemoApplication, lang: Language): DemoApplication {
  const translated = translations[lang].applicationsData[app.id];
  if (!translated) return app;
  return {
    ...app,
    appliedOn: translated.appliedOn,
    desc: translated.desc,
    timeline: app.timeline.map((step, idx) => ({
      ...step,
      label: translated.timeline[idx] ?? step.label,
    })),
    ...(translated.remainingSteps ? { remainingSteps: translated.remainingSteps } : {}),
    ...(translated.flaggedDoc ? { flaggedDoc: translated.flaggedDoc } : {}),
    ...(translated.flaggedReason ? { flaggedReason: translated.flaggedReason } : {}),
    ...(translated.nextSteps ? { nextSteps: translated.nextSteps } : {}),
  };
}

export function getLocalizedApplications(lang: Language): DemoApplication[] {
  return applications.map((app) => localizeApplication(app, lang));
}

export function getLocalizedApplication(id: string, lang: Language): DemoApplication | undefined {
  const app = getApplication(id);
  return app ? localizeApplication(app, lang) : undefined;
}
