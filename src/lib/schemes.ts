import { translations, type Language } from "@/lib/i18n";

export type Category = "Financial Support" | "Agriculture" | "Irrigation" | "Equipment" | "Insurance";

export interface Scheme {
  id: string;
  name: string;
  category: Category;
  short: string;
  beneficiaries: string;
  overview: string;
  whoCanBenefit: string[];
  benefits: string[];
  documents: string[];
  steps: string[];
}

const commonDocs = ["Identity proof (sample)", "Land ownership record", "Bank passbook copy", "Recent passport-size photograph", "Crop sowing declaration"];

export const schemes: Scheme[] = [
  {
    id: "harit-kisan-sahayata",
    name: "Harit Kisan Sahayata Yojana",
    category: "Financial Support",
    short: "Sample annual income support for small and marginal farming families.",
    beneficiaries: "Small & marginal farmers",
    overview: "A fictional scheme that illustrates how direct income support could help farming families meet seasonal expenses such as seeds, fertilisers and labour.",
    whoCanBenefit: ["Small farmers with up to 2 hectares", "Marginal farmers with under 1 hectare", "Farmers with valid land records"],
    benefits: ["Sample support of ₹6,000 per year in three instalments", "Direct transfer to registered bank account", "No middlemen involved"],
    documents: commonDocs,
    steps: ["Check your eligibility on KisanSarthi", "Prepare required documents", "Visit your nearest service centre", "Submit the application form", "Track your application status"],
  },
  {
    id: "beej-samriddhi",
    name: "Beej Samriddhi Mission",
    category: "Agriculture",
    short: "Demo programme offering quality seeds at subsidised rates.",
    beneficiaries: "All registered farmers",
    overview: "A sample mission that demonstrates how certified, high-yield seeds could be distributed at reduced cost through local agriculture offices.",
    whoCanBenefit: ["Registered farmers of any landholding", "Farmer producer groups", "Farmers growing pulses and oilseeds"],
    benefits: ["Up to 50% sample subsidy on certified seeds", "Free soil-testing guidance", "Seasonal crop advisory"],
    documents: commonDocs,
    steps: ["Check eligibility", "Collect seed request form", "Attach documents", "Submit at agriculture office", "Collect seeds on notified date"],
  },
  {
    id: "jal-bindu-sinchai",
    name: "Jal Bindu Sinchai Yojana",
    category: "Irrigation",
    short: "Sample support for drip and sprinkler irrigation systems.",
    beneficiaries: "Farmers with own land",
    overview: "A fictional scheme showing how water-saving micro-irrigation systems could be made affordable for farmers.",
    whoCanBenefit: ["Farmers owning cultivable land", "Horticulture farmers", "Farmers in water-scarce districts"],
    benefits: ["Sample subsidy of 55% for small farmers", "Technical installation support", "Lower water and power usage"],
    documents: commonDocs,
    steps: ["Check eligibility", "Get a quotation from an empanelled vendor", "Submit application with documents", "Field verification", "Installation and subsidy release"],
  },
  {
    id: "yantra-mitra",
    name: "Yantra Mitra Upkaran Yojana",
    category: "Equipment",
    short: "Demo scheme for buying tractors, tillers and farm tools.",
    beneficiaries: "Individual farmers & groups",
    overview: "A sample scheme illustrating support for purchasing modern farm machinery to reduce labour and improve productivity.",
    whoCanBenefit: ["Individual farmers", "Self-help groups", "Custom hiring centres"],
    benefits: ["Sample 40% subsidy on approved equipment", "Priority for women farmers", "Training on safe equipment use"],
    documents: commonDocs,
    steps: ["Check eligibility", "Choose approved equipment", "Apply with documents", "Receive approval letter", "Purchase and claim subsidy"],
  },
  {
    id: "fasal-suraksha-kavach",
    name: "Fasal Suraksha Kavach",
    category: "Insurance",
    short: "Sample crop insurance against weather and pest losses.",
    beneficiaries: "Farmers growing notified crops",
    overview: "A fictional insurance scheme that explains how farmers could protect crops against natural calamities at a low premium.",
    whoCanBenefit: ["Farmers growing notified crops", "Tenant and sharecropping farmers", "Loanee and non-loanee farmers"],
    benefits: ["Low sample premium of 2% for Kharif crops", "Coverage for drought, flood and pests", "Claim settlement to bank account"],
    documents: commonDocs,
    steps: ["Check eligibility", "Enrol before the cut-off date", "Pay the sample premium", "Report crop loss within 72 hours", "Receive claim settlement"],
  },
  {
    id: "kisan-saral-rin",
    name: "Kisan Saral Rin Card",
    category: "Financial Support",
    short: "Demo low-interest credit card for crop and farm needs.",
    beneficiaries: "Owner & tenant farmers",
    overview: "A sample credit facility that shows how farmers could access short-term loans at low interest for cultivation.",
    whoCanBenefit: ["Owner cultivators", "Tenant farmers", "Animal husbandry farmers"],
    benefits: ["Sample interest rate of 4% on timely repayment", "Flexible withdrawal", "Accident cover included"],
    documents: commonDocs,
    steps: ["Check eligibility", "Visit a partner bank", "Fill the application", "Submit documents", "Receive your card"],
  },
];

export const categories = ["All Schemes", "Financial Support", "Agriculture", "Irrigation", "Equipment", "Insurance"] as const;

export const getScheme = (id: string) => schemes.find((s) => s.id === id);

export function getLocalizedScheme(id: string, lang: Language): Scheme | undefined {
  const base = getScheme(id);
  if (!base) return undefined;
  const translated = translations[lang].schemesData[id];
  return translated ? { ...base, ...translated } : base;
}

export function getLocalizedSchemes(lang: Language): Scheme[] {
  return schemes.map((s) => {
    const translated = translations[lang].schemesData[s.id];
    return translated ? { ...s, ...translated } : s;
  });
}

export type ResultStatus = "match" | "more-info" | "insufficient";

export interface EligibilityInput {
  state: string;
  category: string;
  land: string;
  crop: string;
  documents: string;
}

/** Demo-only rule: decides which sample result to show. */
export function evaluateEligibility(i: EligibilityInput): ResultStatus {
  if (!i.state || !i.category || !i.land || !i.crop || !i.documents) return "insufficient";
  if (i.documents === "not-sure") return "insufficient";
  const smallOrMarginal = i.category === "small" || i.category === "marginal";
  if (smallOrMarginal && i.documents === "yes" && i.land !== "above-5") return "match";
  return "more-info";
}
