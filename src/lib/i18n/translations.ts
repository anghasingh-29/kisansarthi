import type { Category, ResultStatus } from "@/lib/schemes";
import type { AppStatus } from "@/lib/applications";
import type { Language } from "./types";

export interface SchemeTranslation {
  name: string;
  short: string;
  beneficiaries: string;
  overview: string;
  whoCanBenefit: string[];
  benefits: string[];
  documents: string[];
  steps: string[];
}

export interface ApplicationTranslation {
  appliedOn: string;
  desc: string;
  timeline: string[];
  remainingSteps?: string[];
  flaggedDoc?: string;
  flaggedReason?: string;
  nextSteps?: string[];
}

export interface TranslationDictionary {
  brand: {
    first: string;
    second: string;
    full: string;
  };
  common: {
    demoInfo: string;
    pageNotFoundCode: string;
    pageNotFoundTitle: string;
    pageNotFoundText: string;
    pageErrorTitle: string;
    pageErrorText: string;
    tryAgain: string;
    goHome: string;
    close: string;
  };
  nav: {
    home: string;
    schemes: string;
    eligibility: string;
    checklist: string;
    status: string;
    toggleMenu: string;
    languageLabel: string;
    englishOption: string;
    hindiOption: string;
    firstVisitTitle: string;
    firstVisitText: string;
    dismissBanner: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    demoNoticeTitle: string;
    demoNoticeText: string;
    copyright: string;
  };
  meta: {
    rootTitle: string;
    homeTitle: string;
    schemesTitle: string;
    schemeNotFoundTitle: string;
    eligibilityTitle: string;
    resultTitle: string;
    checklistTitle: string;
    statusTitle: string;
    statusNotFoundTitle: string;
  };
  home: {
    badge: string;
    heroTitle: string;
    heroSubtitle: string;
    exploreCta: string;
    eligibilityCta: string;
    heroImageAlt: string;
    heroCaptionTitle: string;
    heroCaptionText: string;
    summaryItems: string[];
    toolsHeading: string;
    toolsSubheading: string;
    showcaseEyebrow: string;
    showcaseTitle: string;
    showcaseSubtitle: string;
    showcaseImageAlt: string;
    showcaseCaptionTitle: string;
    showcaseCaptionText: string;
    showcaseSteps: { number: string; title: string; text: string }[];
    showcaseCta: string;
    features: {
      schemes: { title: string; text: string };
      eligibility: { title: string; text: string };
      checklist: { title: string; text: string };
      status: { title: string; text: string };
    };
  };
  categories: Record<"All Schemes" | Category, string>;
  schemesPage: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchAriaLabel: string;
    demoBadge: string;
    whoCanBenefit: string;
    viewDetails: string;
    emptyState: string;
  };
  schemeDetailPage: {
    backToSchemes: string;
    overview: string;
    whoCanBenefit: string;
    sampleBenefits: string;
    howToApply: string;
    requiredDocuments: string;
    readyToCheck: string;
    readyToCheckText: string;
    checkEligibility: string;
    documentChecklist: string;
  };
  schemesData: Record<string, SchemeTranslation>;
  eligibilityPage: {
    title: string;
    subtitle: string;
    selectPlaceholder: string;
    requiredError: string;
    requiredDocsLegend: string;
    requiredDocsHelp: string;
    submitButton: string;
    privacyTitle: string;
    privacyText: string;
    states: Record<string, string>;
    fields: {
      state: { label: string; help: string };
      category: {
        label: string;
        help: string;
        options: { small: string; marginal: string; other: string };
      };
      land: {
        label: string;
        help: string;
        options: { "below-1": string; "1-2": string; "2-5": string; "above-5": string };
      };
      crop: {
        label: string;
        help: string;
        options: { cereals: string; pulses: string; oilseeds: string; horticulture: string; cash: string };
      };
    };
    docOptions: { yes: string; no: string; "not-sure": string };
  };
  resultPage: {
    previewLabel: string;
    whyResult: string;
    nextSteps: string;
    rulesHeading: string;
    rulesIntro: string;
    yourAnswer: string;
    notAnswered: string;
    designPreviewNote: string;
    disclaimer: string;
    checkAgain: string;
    exploreOther: string;
    outcomes: Record<
      ResultStatus,
      {
        title: string;
        text: string;
        reasons: string[];
        steps: string[];
        explanation: string;
      }
    >;
    rules: {
      category: { label: string; detail: string };
      land: { label: string; detail: string };
      documents: { label: string; detail: string };
    };
    answerLabels: {
      category: Record<string, string>;
      land: Record<string, string>;
      documents: Record<string, string>;
    };
  };
  checklistPage: {
    title: string;
    subtitle: string;
    selectedScheme: string;
    sampleSchemeBadge: string;
    progressLabel: string;
    completedSummary: (count: number, total: number) => string;
    resetButton: string;
    docs: { name: string; note: string }[];
  };
  uploads: {
    title: string;
    subtitle: string;
    previewOnlyNotice: string;
    selectAriaLabel: string;
    uploadPdf: string;
    uploadImage: string;
    dragDropPrompt: string;
    browseFiles: string;
    fileLimitHint: string;
    dismissFileError: (name: string) => string;
    selectedFilesCount: (count: number) => string;
    readyToPreview: string;
    preview: string;
    replace: string;
    replaceAriaLabel: (name: string) => string;
    removeTitle: string;
    removeAriaLabel: (name: string) => string;
    closePreview: string;
    pdfFallback: string;
    openPdf: string;
    replacedMsg: (name: string) => string;
    addedMsg: (name: string) => string;
    removedMsg: (name: string) => string;
    invalidTypeClient: string;
  };
  validation: {
    simpleFileName: string;
    maxFileSize: string;
    invalidFileChoice: string;
    typeMismatch: string;
    invalidContent: string;
  };
  statusPage: {
    title: string;
    subtitle: string;
    demoBanner: string;
    appliedOnPrefix: string;
    statuses: Record<AppStatus, string>;
    actions: Record<AppStatus, string>;
  };
  statusDetailPage: {
    backToStatus: string;
    demoRecordBadge: string;
    appliedOnPrefix: string;
    demoDisclaimer: string;
    continueTitle: string;
    continueSubtitle: string;
    stepsTicked: (done: number, total: number) => string;
    openEligibility: string;
    documentChecklist: string;
    actionRequired: string;
    markedCorrectedDemo: string;
    markCorrectedBtn: string;
    readyForSubmission: string;
    underReview: string;
    whatHappensNext: string;
    progressTimeline: string;
    currentStepBadge: string;
    applicationSummary: string;
    referenceLabel: string;
    statusLabel: string;
    appliedOnLabel: string;
    schemeLabel: string;
    viewSchemeDetails: string;
    documentsForApp: string;
    openDocumentChecklist: string;
  };
  applicationsData: Record<string, ApplicationTranslation>;
  assistant: {
    askAiButton: string;
    askAiAriaLabel: string;
    subtitle: string;
    closeAriaLabel: string;
    stopGeneratingAriaLabel: string;
    sendMessageAriaLabel: string;
    welcome: string;
    placeholder: string;
    thinking: string;
    listen: string;
    pause: string;
    resume: string;
    replay: string;
    stop: string;
    loadingAudio: string;
    speaking: string;
    paused: string;
    clear: string;
    mic: string;
    micOff: string;
    listening: string;
    listeningHindi: string;
    listeningEnglish: string;
    noMic: string;
    noMicHardware: string;
    micNetworkError: string;
    denied: string;
    noSpeech: string;
    noVoice: string;
    noHindiVoiceFallback: string;
    noEnglishVoiceFallback: string;
    voiceModeLabel: string;
    voiceModeTextOnly: string;
    voiceModeAuto: string;
    voiceModeOnDemand: string;
    note: string;
    suggestions: string[];
    title: string;
    error402: string;
    error429: string;
    errorGeneric: string;
  };
  accessibility: {
    skipToContent: string;
    triggerLabel: string;
    triggerAriaLabel: string;
    panelTitle: string;
    panelSubtitle: string;
    closePanel: string;
    resetAll: string;
    activeCountLabel: (count: number) => string;
    osMatchButton: string;
    osStatusNote: (motion: boolean, dark: boolean, contrast: boolean) => string;
    tabs: {
      text: string;
      color: string;
      assist: string;
    };
    preview: {
      title: string;
      headingSample: string;
      bodySample: string;
      linkSample: string;
    };
    textSize: {
      sectionTitle: string;
      bodySizeLabel: string;
      bodySizeDesc: string;
      decreaseBtn: string;
      defaultBtn: string;
      increaseBtn: string;
      defaultTag: string;
      headingScaleLabel: string;
      headingScaleDesc: string;
      interfaceScaleLabel: string;
      interfaceScaleDesc: string;
      enlargeControlsLabel: string;
      enlargeControlsDesc: string;
    };
    dyslexia: {
      sectionTitle: string;
      readingLinksTitle: string;
      dyslexiaModeLabel: string;
      dyslexiaModeDesc: string;
      textSpaceLabel: string;
      textSpaceDesc: string;
      fontFamilyLabel: string;
      fontFamilyDesc: string;
      fonts: {
        default: string;
        dyslexic: string;
        arial: string;
        verdana: string;
        "open-sans": string;
      };
      letterSpacingLabel: string;
      letterSpacingDesc: string;
      wordSpacingLabel: string;
      wordSpacingDesc: string;
      lineHeightLabel: string;
      lineHeightDesc: string;
      leftAlignLabel: string;
      leftAlignDesc: string;
      reducedClutterLabel: string;
      reducedClutterDesc: string;
      readingRulerLabel: string;
      readingRulerDesc: string;
    };
    color: {
      sectionTitle: string;
      presetsLabel: string;
      presetsDesc: string;
      modes: {
        default: string;
        light: string;
        dark: string;
        "high-contrast": string;
        "low-contrast": string;
        cream: string;
        protanopia: string;
        deuteranopia: string;
        tritanopia: string;
      };
      customColorsTitle: string;
      customColorsDesc: string;
      enableCustomColors: string;
      textColorLabel: string;
      bgColorLabel: string;
      contrastRatioLabel: string;
      contrastPassAa: string;
      contrastPassAaa: string;
      contrastLowWarn: string;
      inversionTitle: string;
      invertColorsLabel: string;
      invertColorsDesc: string;
      preserveImagesLabel: string;
      preserveImagesDesc: string;
    };
    assist: {
      sectionTitle: string;
      reduceAnimationsLabel: string;
      reduceAnimationsDesc: string;
      highlightLinksLabel: string;
      highlightLinksDesc: string;
      highlightFocusLabel: string;
      highlightFocusDesc: string;
      wcagNote: string;
    };
  };
}

const commonDocsEn = [
  "Identity proof (sample)",
  "Land ownership record",
  "Bank passbook copy",
  "Recent passport-size photograph",
  "Crop sowing declaration",
];

const commonDocsHi = [
  "पहचान पत्र (सैंपल)",
  "ज़मीन के कागज़ (खतौनी / भू-अभिलेख)",
  "बैंक पासबुक की कॉपी",
  "हाल की पासपोर्ट साइज फोटो",
  "फसल बुवाई का स्व-घोषणा पत्र",
];

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      first: "Kisan",
      second: "Sarthi",
      full: "KisanSarthi",
    },
    common: {
      demoInfo: "Demo information",
      pageNotFoundCode: "404",
      pageNotFoundTitle: "Page not found",
      pageNotFoundText: "The page you're looking for doesn't exist or has been moved.",
      pageErrorTitle: "This page didn't load",
      pageErrorText: "Something went wrong on our end. You can try refreshing or head back home.",
      tryAgain: "Try again",
      goHome: "Go home",
      close: "Close",
    },
    nav: {
      home: "Home",
      schemes: "Explore Schemes",
      eligibility: "Eligibility Checker",
      checklist: "Document Checklist",
      status: "Application Status",
      toggleMenu: "Toggle menu",
      languageLabel: "Language",
      englishOption: "English",
      hindiOption: "हिंदी",
      firstVisitTitle: "Choose language / भाषा चुनें",
      firstVisitText: "View KisanSarthi in English or simple Hindi.",
      dismissBanner: "Dismiss language prompt",
    },
    footer: {
      tagline: "Helping farmers explore schemes, check sample eligibility and prepare documents.",
      quickLinks: "Quick Links",
      demoNoticeTitle: "Demo Notice",
      demoNoticeText:
        "All schemes, results and records on this site are fictional sample data, not official government information.",
      copyright: "© 2026 KisanSarthi · Government Schemes & Eligibility Portal (Demo)",
    },
    meta: {
      rootTitle: "KisanSarthi – Government Schemes & Eligibility Portal",
      homeTitle: "KisanSarthi – Schemes & Eligibility for Farmers",
      schemesTitle: "Explore Government Schemes – KisanSarthi",
      schemeNotFoundTitle: "Scheme not found – KisanSarthi",
      eligibilityTitle: "Check Your Eligibility – KisanSarthi",
      resultTitle: "Eligibility Result – KisanSarthi",
      checklistTitle: "Your Document Checklist – KisanSarthi",
      statusTitle: "Application Status – KisanSarthi",
      statusNotFoundTitle: "Application not found – KisanSarthi",
    },
    home: {
      badge: "Demo portal",
      heroTitle: "Government schemes made simple for every farmer.",
      heroSubtitle: "Find schemes, check sample eligibility and get your documents ready — all in one place.",
      exploreCta: "Explore Schemes",
      eligibilityCta: "Check Eligibility",
      heroImageAlt: "Smiling Indian woman farmer holding freshly harvested golden wheat stalks in a sunny field",
      heroCaptionTitle: "Harvest Support & Subsidies",
      heroCaptionText: "Direct income support, soil care, irrigation, and crop insurance guides.",
      summaryItems: ["6 Sample Schemes", "5-Step Eligibility Check", "Bilingual EN / हिंदी"],
      toolsHeading: "Everything you need to prepare",
      toolsSubheading: "Four simple tools designed for clarity on desktop and mobile.",
      showcaseEyebrow: "Season after season",
      showcaseTitle: "From field preparation to application readiness.",
      showcaseSubtitle:
        "Whether you are preparing kharif paddy fields or harvesting winter wheat, keep your scheme eligibility and paperwork organized ahead of time.",
      showcaseImageAlt: "Indian farmer ploughing a lush green field with a pair of white bullocks during sowing season",
      showcaseCaptionTitle: "Kharif & Rabi Sowing Readiness",
      showcaseCaptionText: "Prepare land records, bank passbook, and crop details before seasonal deadlines.",
      showcaseSteps: [
        {
          number: "01",
          title: "Compare schemes by category",
          text: "Filter financial support, irrigation, equipment, and crop insurance benefits.",
        },
        {
          number: "02",
          title: "Check sample eligibility in seconds",
          text: "No Aadhaar, bank details, or passwords needed — answer five quick questions.",
        },
        {
          number: "03",
          title: "Organize documents before you apply",
          text: "Preview your PDFs and photos privately and track sample progress anytime.",
        },
      ],
      showcaseCta: "Prepare Document Checklist",
      features: {
        schemes: { title: "Explore Schemes", text: "Browse sample schemes by category." },
        eligibility: { title: "Check Eligibility", text: "Answer 5 simple questions." },
        checklist: { title: "Document Checklist", text: "Track documents you have ready." },
        status: { title: "Application Status", text: "See sample application progress." },
      },
    },
    categories: {
      "All Schemes": "All Schemes",
      "Financial Support": "Financial Support",
      Agriculture: "Agriculture",
      Irrigation: "Irrigation",
      Equipment: "Equipment",
      Insurance: "Insurance",
    },
    schemesPage: {
      title: "Explore Government Schemes",
      subtitle: "Find schemes that match your farming needs.",
      searchPlaceholder: "Search schemes by name or keyword",
      searchAriaLabel: "Search schemes",
      demoBadge: "Fictional sample schemes",
      whoCanBenefit: "Who can benefit:",
      viewDetails: "View Details",
      emptyState: "No schemes found. Try a different search.",
    },
    schemeDetailPage: {
      backToSchemes: "Back to Schemes",
      overview: "Overview",
      whoCanBenefit: "Who Can Benefit",
      sampleBenefits: "Sample Benefits",
      howToApply: "How to Apply",
      requiredDocuments: "Required Documents",
      readyToCheck: "Ready to check?",
      readyToCheckText: "Answer a few simple questions to see a sample result.",
      checkEligibility: "Check Eligibility",
      documentChecklist: "Document Checklist",
    },
    schemesData: {
      "harit-kisan-sahayata": {
        name: "Harit Kisan Sahayata Yojana",
        short: "Sample annual income support for small and marginal farming families.",
        beneficiaries: "Small & marginal farmers",
        overview:
          "A fictional scheme that illustrates how direct income support could help farming families meet seasonal expenses such as seeds, fertilisers and labour.",
        whoCanBenefit: [
          "Small farmers with up to 2 hectares",
          "Marginal farmers with under 1 hectare",
          "Farmers with valid land records",
        ],
        benefits: [
          "Sample support of ₹6,000 per year in three instalments",
          "Direct transfer to registered bank account",
          "No middlemen involved",
        ],
        documents: commonDocsEn,
        steps: [
          "Check your eligibility on KisanSarthi",
          "Prepare required documents",
          "Visit your nearest service centre",
          "Submit the application form",
          "Track your application status",
        ],
      },
      "beej-samriddhi": {
        name: "Beej Samriddhi Mission",
        short: "Demo programme offering quality seeds at subsidised rates.",
        beneficiaries: "All registered farmers",
        overview:
          "A sample mission that demonstrates how certified, high-yield seeds could be distributed at reduced cost through local agriculture offices.",
        whoCanBenefit: [
          "Registered farmers of any landholding",
          "Farmer producer groups",
          "Farmers growing pulses and oilseeds",
        ],
        benefits: [
          "Up to 50% sample subsidy on certified seeds",
          "Free soil-testing guidance",
          "Seasonal crop advisory",
        ],
        documents: commonDocsEn,
        steps: [
          "Check eligibility",
          "Collect seed request form",
          "Attach documents",
          "Submit at agriculture office",
          "Collect seeds on notified date",
        ],
      },
      "jal-bindu-sinchai": {
        name: "Jal Bindu Sinchai Yojana",
        short: "Sample support for drip and sprinkler irrigation systems.",
        beneficiaries: "Farmers with own land",
        overview:
          "A fictional scheme showing how water-saving micro-irrigation systems could be made affordable for farmers.",
        whoCanBenefit: [
          "Farmers owning cultivable land",
          "Horticulture farmers",
          "Farmers in water-scarce districts",
        ],
        benefits: [
          "Sample subsidy of 55% for small farmers",
          "Technical installation support",
          "Lower water and power usage",
        ],
        documents: commonDocsEn,
        steps: [
          "Check eligibility",
          "Get a quotation from an empanelled vendor",
          "Submit application with documents",
          "Field verification",
          "Installation and subsidy release",
        ],
      },
      "yantra-mitra": {
        name: "Yantra Mitra Upkaran Yojana",
        short: "Demo scheme for buying tractors, tillers and farm tools.",
        beneficiaries: "Individual farmers & groups",
        overview:
          "A sample scheme illustrating support for purchasing modern farm machinery to reduce labour and improve productivity.",
        whoCanBenefit: ["Individual farmers", "Self-help groups", "Custom hiring centres"],
        benefits: [
          "Sample 40% subsidy on approved equipment",
          "Priority for women farmers",
          "Training on safe equipment use",
        ],
        documents: commonDocsEn,
        steps: [
          "Check eligibility",
          "Choose approved equipment",
          "Apply with documents",
          "Receive approval letter",
          "Purchase and claim subsidy",
        ],
      },
      "fasal-suraksha-kavach": {
        name: "Fasal Suraksha Kavach",
        short: "Sample crop insurance against weather and pest losses.",
        beneficiaries: "Farmers growing notified crops",
        overview:
          "A fictional insurance scheme that explains how farmers could protect crops against natural calamities at a low premium.",
        whoCanBenefit: [
          "Farmers growing notified crops",
          "Tenant and sharecropping farmers",
          "Loanee and non-loanee farmers",
        ],
        benefits: [
          "Low sample premium of 2% for Kharif crops",
          "Coverage for drought, flood and pests",
          "Claim settlement to bank account",
        ],
        documents: commonDocsEn,
        steps: [
          "Check eligibility",
          "Enrol before the cut-off date",
          "Pay the sample premium",
          "Report crop loss within 72 hours",
          "Receive claim settlement",
        ],
      },
      "kisan-saral-rin": {
        name: "Kisan Saral Rin Card",
        short: "Demo low-interest credit card for crop and farm needs.",
        beneficiaries: "Owner & tenant farmers",
        overview:
          "A sample credit facility that shows how farmers could access short-term loans at low interest for cultivation.",
        whoCanBenefit: ["Owner cultivators", "Tenant farmers", "Animal husbandry farmers"],
        benefits: [
          "Sample interest rate of 4% on timely repayment",
          "Flexible withdrawal",
          "Accident cover included",
        ],
        documents: commonDocsEn,
        steps: [
          "Check eligibility",
          "Visit a partner bank",
          "Fill the application",
          "Submit documents",
          "Receive your card",
        ],
      },
    },
    eligibilityPage: {
      title: "Check Your Eligibility",
      subtitle: "Answer five simple questions. It takes less than a minute.",
      selectPlaceholder: "-- Select --",
      requiredError: "This field is required.",
      requiredDocsLegend: "Required Documents Available?",
      requiredDocsHelp: "Such as land record, identity proof and bank passbook.",
      submitButton: "Check Eligibility",
      privacyTitle: "Your privacy is safe",
      privacyText:
        "We never ask for your Aadhaar number, bank account details, OTP or passwords. Never share these with anyone online.",
      states: {
        "Andhra Pradesh": "Andhra Pradesh",
        Bihar: "Bihar",
        Gujarat: "Gujarat",
        Haryana: "Haryana",
        Karnataka: "Karnataka",
        "Madhya Pradesh": "Madhya Pradesh",
        Maharashtra: "Maharashtra",
        Punjab: "Punjab",
        Rajasthan: "Rajasthan",
        "Tamil Nadu": "Tamil Nadu",
        "Uttar Pradesh": "Uttar Pradesh",
        "West Bengal": "West Bengal",
      },
      fields: {
        state: {
          label: "Select State",
          help: "Choose the state where your farmland is located.",
        },
        category: {
          label: "Farmer Category",
          help: "Marginal: under 1 hectare. Small: 1–2 hectares.",
          options: {
            small: "Small Farmer",
            marginal: "Marginal Farmer",
            other: "Other",
          },
        },
        land: {
          label: "Approximate Landholding",
          help: "An estimate is fine. 1 hectare ≈ 2.5 acres.",
          options: {
            "below-1": "Less than 1 hectare",
            "1-2": "1 to 2 hectares",
            "2-5": "2 to 5 hectares",
            "above-5": "More than 5 hectares",
          },
        },
        crop: {
          label: "Crop Type",
          help: "Select the main crop you grow this season.",
          options: {
            cereals: "Cereals (Wheat, Rice)",
            pulses: "Pulses",
            oilseeds: "Oilseeds",
            horticulture: "Fruits & Vegetables",
            cash: "Cash Crops (Cotton, Sugarcane)",
          },
        },
      },
      docOptions: {
        yes: "Yes",
        no: "No",
        "not-sure": "Not Sure",
      },
    },
    resultPage: {
      previewLabel: "Preview result designs:",
      whyResult: "Why you see this result",
      nextSteps: "Recommended next steps",
      rulesHeading: "How this result was checked (sample rules)",
      rulesIntro:
        "The sample checker compares your answers against three simple rules used by the sample financial support schemes for small and marginal farmers.",
      yourAnswer: "Your answer:",
      notAnswered: "Not answered on the form.",
      designPreviewNote: "This is a design preview. Fill the eligibility checker to see your own answers against these rules.",
      disclaimer:
        "This is a demonstration result based on sample information. It is not an official government eligibility decision.",
      checkAgain: "Check Again",
      exploreOther: "Explore Other Schemes",
      outcomes: {
        match: {
          title: "Potential Match",
          text: "Based on your answers, you may be a potential match for sample financial support schemes.",
          reasons: [
            "Your farmer category is Small or Marginal",
            "Your landholding is within the sample limit (5 hectares or less)",
            "You said your documents are ready",
          ],
          steps: [
            "Review the scheme details carefully",
            "Complete your document checklist",
            "Visit your nearest service centre to apply",
          ],
          explanation: "All three sample rules passed, so a potential match is shown.",
        },
        "more-info": {
          title: "More Information Needed",
          text: "Some of your answers need more details before a sample match can be shown.",
          reasons: [
            "One or more answers did not meet the sample rules below",
            "Some required documents may not be available",
          ],
          steps: [
            "Gather your missing documents",
            "Talk to your local agriculture officer",
            "Explore other schemes that may fit better",
          ],
          explanation:
            "One or more answers differ from the sample rules above, so more details are needed before a match can be shown.",
        },
        insufficient: {
          title: "Insufficient Information",
          text: "We could not show a sample result with the information provided.",
          reasons: [
            "One or more answers were incomplete",
            "You were not sure about document availability",
          ],
          steps: [
            "Check which documents you have at home",
            "Fill the eligibility form again",
            "Ask a family member or service centre for help",
          ],
          explanation:
            "Some answers were missing or marked 'Not sure', so the sample rules could not be checked.",
        },
      },
      rules: {
        category: {
          label: "Farmer category is Small or Marginal",
          detail: "The sample match is aimed at small and marginal farming families.",
        },
        land: {
          label: "Landholding is 5 hectares or less",
          detail: "1 hectare is about 2.5 acres, so 5 hectares is about 12.5 acres.",
        },
        documents: {
          label: "Required documents are available",
          detail: "Such as land record, identity proof and bank passbook.",
        },
      },
      answerLabels: {
        category: {
          small: "Small Farmer",
          marginal: "Marginal Farmer",
          other: "Other farmer",
        },
        land: {
          "below-1": "Less than 1 hectare",
          "1-2": "1 to 2 hectares",
          "2-5": "2 to 5 hectares",
          "above-5": "More than 5 hectares",
        },
        documents: {
          yes: "Documents available",
          no: "Documents not available",
          "not-sure": "Not sure yet",
        },
      },
    },
    checklistPage: {
      title: "Your Document Checklist",
      subtitle: "Tick each document once you have it ready.",
      selectedScheme: "Selected scheme",
      sampleSchemeBadge: "Sample scheme",
      progressLabel: "Progress",
      completedSummary: (count, total) => `${count} out of ${total} documents completed`,
      resetButton: "Reset Checklist",
      docs: [
        { name: "Identity Proof", note: "Any government-issued photo ID (sample)" },
        { name: "Land Ownership Record", note: "Khatauni / RoR / land record copy" },
        { name: "Bank Passbook Copy", note: "First page showing name and branch" },
        { name: "Passport-size Photograph", note: "Recent colour photo" },
        { name: "Crop Sowing Declaration", note: "Self-declaration of crops grown" },
      ],
    },
    uploads: {
      title: "Upload Documents & Images",
      subtitle: "Select a PDF or Photo from your phone.",
      previewOnlyNotice:
        "Preview only: files stay on this device and are not saved or sent anywhere. They disappear when you close or reload this page.",
      selectAriaLabel: "Select documents and images",
      uploadPdf: "Upload PDF",
      uploadImage: "Upload Image",
      dragDropPrompt: "Drag and drop your files here",
      browseFiles: "Browse Files",
      fileLimitHint: "PDF, JPG, JPEG or PNG · Up to 10 MB per file",
      dismissFileError: (name) => `Dismiss ${name}`,
      selectedFilesCount: (count) => `Selected files (${count})`,
      readyToPreview: "Ready to preview · not saved",
      preview: "Preview",
      replace: "Replace",
      replaceAriaLabel: (name) => `Replace ${name}`,
      removeTitle: "Remove file",
      removeAriaLabel: (name) => `Remove ${name}`,
      closePreview: "Close preview",
      pdfFallback: "Your phone may not show a PDF preview.",
      openPdf: "Open PDF",
      replacedMsg: (name) => `Replaced with ${name}.`,
      addedMsg: (name) => `${name} added for preview.`,
      removedMsg: (name) => `${name} removed.`,
      invalidTypeClient: "Choose a PDF, JPG, JPEG or PNG file.",
    },
    validation: {
      simpleFileName: "Please use a simple file name.",
      maxFileSize: "Each file must be 10 MB or smaller.",
      invalidFileChoice: "Choose a PDF, JPG, JPEG, PNG or WEBP file with a simple file name.",
      typeMismatch: "The file type does not match its name. Choose a PDF or photo.",
      invalidContent: "This file is not a valid PDF or photo. Please choose another file.",
    },
    statusPage: {
      title: "Application Status",
      subtitle: "Track the progress of your scheme applications.",
      demoBanner: "All application records shown here are fictional demonstration data.",
      appliedOnPrefix: "Applied on",
      statuses: {
        draft: "Draft",
        prepared: "Prepared",
        submitted: "Submitted (Demo)",
        "update-needed": "Update Needed",
      },
      actions: {
        draft: "Continue",
        prepared: "View Details",
        submitted: "View Details",
        "update-needed": "Review",
      },
    },
    statusDetailPage: {
      backToStatus: "Back to Application Status",
      demoRecordBadge: "Fictional demonstration record",
      appliedOnPrefix: "Applied on",
      demoDisclaimer:
        "This application record is fictional demonstration data. Nothing here is a real application and no information is saved.",
      continueTitle: "Continue your application",
      continueSubtitle: "Tick each step as you finish it. This is a demonstration checklist — nothing is saved or submitted.",
      stepsTicked: (done, total) => `${done} of ${total} steps ticked in this demo.`,
      openEligibility: "Open Eligibility Checker",
      documentChecklist: "Document Checklist",
      actionRequired: "Action required",
      markedCorrectedDemo: "Marked as corrected in this demo (nothing was actually uploaded).",
      markCorrectedBtn: "Mark as corrected (Demo)",
      readyForSubmission: "Ready for submission",
      underReview: "Under review",
      whatHappensNext: "What happens next",
      progressTimeline: "Progress timeline",
      currentStepBadge: "Current step",
      applicationSummary: "Application summary",
      referenceLabel: "Reference",
      statusLabel: "Status",
      appliedOnLabel: "Applied on",
      schemeLabel: "Scheme",
      viewSchemeDetails: "View scheme details",
      documentsForApp: "Documents for this application",
      openDocumentChecklist: "Open Document Checklist",
    },
    applicationsData: {
      "KS-DEMO-0001": {
        appliedOn: "01 Jan 2099 (Demo)",
        desc: "Your application is saved but not yet complete.",
        timeline: ["Application started", "Complete your details and documents", "Submit for review"],
        remainingSteps: [
          "Fill in farmer and land details",
          "Confirm bank account information",
          "Attach a copy of the land ownership record",
          "Review everything and submit",
        ],
      },
      "KS-DEMO-0002": {
        appliedOn: "15 Feb 2099 (Demo)",
        desc: "All details and documents are ready for submission.",
        timeline: [
          "Application started",
          "Details completed",
          "Documents attached",
          "Ready to submit",
          "Review and verification",
        ],
        nextSteps: [
          "Submit the application at your nearest service centre",
          "A field officer may visit to verify the land",
          "After approval, the vendor installs the system and the subsidy is released",
        ],
      },
      "KS-DEMO-0003": {
        appliedOn: "10 Mar 2099 (Demo)",
        desc: "Your sample application has been submitted for review.",
        timeline: [
          "Application started",
          "Details completed",
          "Documents attached",
          "Submitted for review",
          "Under review by the department",
          "Decision and enrolment confirmation",
        ],
        nextSteps: [
          "The department checks your crop and land details",
          "You will receive a confirmation once enrolment is approved",
          "Report any crop loss within 72 hours after the approval",
        ],
      },
      "KS-DEMO-0004": {
        appliedOn: "22 Apr 2099 (Demo)",
        desc: "A document needs to be re-uploaded or corrected.",
        timeline: [
          "Application started",
          "Details completed",
          "Documents attached",
          "Submitted for review",
          "Fix the flagged document",
          "Re-submission and review",
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
    },
    assistant: {
      askAiButton: "Ask AI",
      askAiAriaLabel: "Ask AI farming assistant",
      subtitle: "KisanSarthi · AI",
      closeAriaLabel: "Close",
      stopGeneratingAriaLabel: "Stop",
      sendMessageAriaLabel: "Submit",
      welcome: "Namaste! Welcome to your Farming Assistant. Ask in English, Hindi, or Hinglish.",
      placeholder: "Type or speak in English, Hindi, or Hinglish…",
      thinking: "Thinking…",
      listen: "Listen",
      pause: "Pause",
      resume: "Resume",
      replay: "Replay",
      stop: "Stop",
      loadingAudio: "Preparing audio…",
      speaking: "Speaking…",
      paused: "Paused",
      clear: "Clear chat",
      mic: "Speak your question",
      micOff: "Stop listening",
      listening: "Listening… speak now (you can edit before sending)",
      listeningHindi: "Listening (Hindi)… speak now",
      listeningEnglish: "Listening (English)… speak now",
      noMic: "Voice input is not supported in this browser. Please type your question.",
      noMicHardware: "No microphone was found. Connect a microphone or type your question.",
      micNetworkError: "Voice recognition had a network issue. Please try again or type your question.",
      denied: "Microphone permission was blocked. Allow microphone access in browser settings, or type your question.",
      noSpeech: "We did not hear anything. Please speak clearly and try again.",
      noVoice: "Spoken answers (Text-to-Speech) are not available in this browser.",
      noHindiVoiceFallback: "No dedicated Hindi voice was found on this device; using system speech settings.",
      noEnglishVoiceFallback: "No dedicated English voice was found on this device; using system speech settings.",
      voiceModeLabel: "Voice reply",
      voiceModeTextOnly: "Text only",
      voiceModeAuto: "Text + Auto voice",
      voiceModeOnDemand: "Listen button",
      note: "AI answers are general guidance and can be wrong. Encourage soil testing and consult your local KVK or agriculture officer before acting.",
      suggestions: [
        "How can I improve soil fertility?",
        "Why are my crop leaves turning yellow?",
        "Which fertilizer should I use?",
        "How can I control pests?",
      ],
      title: "Farming Assistant",
      error402: "The AI service limit has been reached. Please try again later.",
      error429: "Too many questions right now. Please wait a moment and try again.",
      errorGeneric: "Could not get an answer. Check your internet and send again.",
    },
    accessibility: {
      skipToContent: "Skip to main content",
      triggerLabel: "Accessibility",
      triggerAriaLabel: "Open accessibility and personalization settings",
      panelTitle: "Accessibility & Display",
      panelSubtitle: "Customize text, colors, reading guides, and motion across all pages.",
      closePanel: "Close accessibility panel",
      resetAll: "Reset to default",
      activeCountLabel: (count) => (count === 0 ? "Default display active" : `${count} setting${count === 1 ? "" : "s"} active`),
      osMatchButton: "Match OS settings",
      osStatusNote: (motion, dark, contrast) => {
        const parts: string[] = [];
        if (motion) parts.push("Reduced motion");
        if (dark) parts.push("Dark appearance");
        if (contrast) parts.push("More contrast");
        return parts.length > 0 ? `Detected OS preference: ${parts.join(", ")}` : "No special OS display overrides detected.";
      },
      tabs: {
        text: "Text & Dyslexia",
        color: "Colors & Contrast",
        assist: "Motion & Focus",
      },
      preview: {
        title: "Live preview",
        headingSample: "PM-KISAN Farmer Guide",
        bodySample: "Adjust text size, spacing, font, or colors and see changes immediately without losing content.",
        linkSample: "Check scheme eligibility",
      },
      textSize: {
        sectionTitle: "Text size & scaling",
        bodySizeLabel: "Body text size",
        bodySizeDesc: "Resize paragraphs, labels, and form text independently from 12px to 32px.",
        decreaseBtn: "A-",
        defaultBtn: "A",
        increaseBtn: "A+",
        defaultTag: "Default",
        headingScaleLabel: "Heading size",
        headingScaleDesc: "Scale page titles and section headings independently from body text.",
        interfaceScaleLabel: "Interface scale",
        interfaceScaleDesc: "Scale cards, spacing, and UI proportions together across the site.",
        enlargeControlsLabel: "Enlarge menus & buttons",
        enlargeControlsDesc: "Increases navigation links, buttons, checkboxes, and touch targets.",
      },
      dyslexia: {
        sectionTitle: "Dyslexia & reading comfort",
        readingLinksTitle: "Reading & Links",
        dyslexiaModeLabel: "Dyslexia Mode",
        dyslexiaModeDesc:
          "Sets a dyslexia-friendly font, comfortable text space, left alignment, low-glare warm tint, and clean layout.",
        textSpaceLabel: "Text Space",
        textSpaceDesc: "Turns wider letter, word, and line spacing on or off.",
        fontFamilyLabel: "Font family",
        fontFamilyDesc: "Switch between the default style, dyslexia-friendly, or high-legibility fonts.",
        fonts: {
          default: "Default (Poppins)",
          dyslexic: "Dyslexia-friendly (Lexend)",
          arial: "Arial",
          verdana: "Verdana",
          "open-sans": "Open Sans",
        },
        letterSpacingLabel: "Letter spacing",
        letterSpacingDesc: "Add breathing room between characters to prevent crowding.",
        wordSpacingLabel: "Word spacing",
        wordSpacingDesc: "Increase gaps between words for easier line tracking.",
        lineHeightLabel: "Line spacing",
        lineHeightDesc: "Adjust vertical distance between lines of text.",
        leftAlignLabel: "Left-align text",
        leftAlignDesc: "Aligns centered headings and text blocks to a steady left edge.",
        reducedClutterLabel: "Reduced visual clutter",
        reducedClutterDesc: "Hides decorative shadows, gradients, and photo captions.",
        readingRulerLabel: "Reading ruler guide",
        readingRulerDesc: "Shows a horizontal focus band following your pointer or keyboard focus.",
      },
      color: {
        sectionTitle: "Color & contrast modes",
        presetsLabel: "Display & color-vision modes",
        presetsDesc: "Designed for dark/light preference, glare reduction, high contrast, and color blindness.",
        modes: {
          default: "Site Default",
          light: "Light",
          dark: "Dark",
          "high-contrast": "High Contrast",
          "low-contrast": "Low Contrast",
          cream: "Warm Cream",
          protanopia: "Protanopia-friendly",
          deuteranopia: "Deuteranopia-friendly",
          tritanopia: "Tritanopia-friendly",
        },
        customColorsTitle: "Custom foreground & background",
        customColorsDesc: "Pick your own text and page background colors with live WCAG contrast checking.",
        enableCustomColors: "Use custom colors",
        textColorLabel: "Text color",
        bgColorLabel: "Background color",
        contrastRatioLabel: "Contrast ratio",
        contrastPassAa: "Meets WCAG AA",
        contrastPassAaa: "Meets WCAG AAA",
        contrastLowWarn: "Low contrast (aim for 4.5:1+)",
        inversionTitle: "Color inversion",
        invertColorsLabel: "Invert website colors",
        invertColorsDesc: "Flips light and dark colors across the entire website.",
        preserveImagesLabel: "Preserve image & video colors",
        preserveImagesDesc: "Keeps photographs and videos in their natural colors when inverted.",
      },
      assist: {
        sectionTitle: "Motion, links & keyboard support",
        reduceAnimationsLabel: "Reduce animations & transitions",
        reduceAnimationsDesc: "Stops hover motion, slide animations, and smooth scrolling (also honors OS preference).",
        highlightLinksLabel: "Highlight all links",
        highlightLinksDesc: "Adds strong underlines and dashed outlines to clickable links.",
        highlightFocusLabel: "Highlight keyboard focus",
        highlightFocusDesc: "Shows a bold dual-ring focus indicator when navigating with Tab.",
        wcagNote: "Preferences save automatically in this browser and apply across every page.",
      },
    },
  },
  hi: {
    brand: {
      first: "किसान",
      second: "सारथी",
      full: "किसानसारथी",
    },
    common: {
      demoInfo: "डेमो जानकारी",
      pageNotFoundCode: "404",
      pageNotFoundTitle: "पेज नहीं मिला",
      pageNotFoundText: "आप जो पेज देख रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
      pageErrorTitle: "यह पेज लोड नहीं हो पाया",
      pageErrorText: "हमारी तरफ़ से कोई तकनीकी समस्या आ गई। कृपया पेज रीफ़्रेश करें या होम पेज पर जाएं।",
      tryAgain: "फिर से कोशिश करें",
      goHome: "होम पर जाएं",
      close: "बंद करें",
    },
    nav: {
      home: "होम",
      schemes: "योजनाएं देखें",
      eligibility: "पात्रता जांचें",
      checklist: "दस्तावेज़ सूची",
      status: "आवेदन की स्थिति",
      toggleMenu: "मेनू खोलें या बंद करें",
      languageLabel: "भाषा",
      englishOption: "English",
      hindiOption: "हिंदी",
      firstVisitTitle: "अपनी भाषा चुनें / Choose language",
      firstVisitText: "आप किसानसारथी पोर्टल को हिंदी या अंग्रेज़ी में देख सकते हैं।",
      dismissBanner: "भाषा सूचना बंद करें",
    },
    footer: {
      tagline: "किसानों को सरकारी योजनाओं की जानकारी खोजने, सैंपल पात्रता जांचने और दस्तावेज़ तैयार करने में मदद।",
      quickLinks: "ज़रूरी लिंक",
      demoNoticeTitle: "डेमो सूचना",
      demoNoticeText:
        "इस वेबसाइट पर दिखाई गई सभी योजनाएं, नतीजे और आवेदन रिकॉर्ड केवल उदाहरण (डेमो) हैं, यह आधिकारिक सरकारी जानकारी नहीं है।",
      copyright: "© 2026 किसानसारथी · सरकारी योजना एवं पात्रता पोर्टल (डेमो)",
    },
    meta: {
      rootTitle: "किसानसारथी – सरकारी योजना एवं पात्रता पोर्टल",
      homeTitle: "किसानसारथी – किसानों के लिए योजनाएं और पात्रता",
      schemesTitle: "सरकारी योजनाएं देखें – किसानसारथी",
      schemeNotFoundTitle: "योजना नहीं मिली – किसानसारथी",
      eligibilityTitle: "अपनी पात्रता जांचें – किसानसारथी",
      resultTitle: "पात्रता परिणाम – किसानसारथी",
      checklistTitle: "दस्तावेज़ सूची – किसानसारथी",
      statusTitle: "आवेदन की स्थिति – किसानसारथी",
      statusNotFoundTitle: "आवेदन नहीं मिला – किसानसारथी",
    },
    home: {
      badge: "डेमो पोर्टल",
      heroTitle: "हर किसान के लिए सरकारी योजनाओं की आसान जानकारी।",
      heroSubtitle: "योजनाएं खोजें, सैंपल पात्रता जांचें और अपने दस्तावेज़ तैयार करें — सब कुछ एक ही जगह।",
      exploreCta: "योजनाएं देखें",
      eligibilityCta: "पात्रता जांचें",
      heroImageAlt: "धूप से सुनहरे गेहूँ के खेत में कटाई करती हुई मुस्कुराती भारतीय महिला किसान",
      heroCaptionTitle: "फसल सहायता और सब्सिडी मार्गदर्शन",
      heroCaptionText: "आर्थिक सहायता, मिट्टी स्वास्थ्य, सिंचाई और फसल बीमा की सरल जानकारी।",
      summaryItems: ["6 सैंपल योजनाएं", "5-चरणीय पात्रता जांच", "अंग्रेज़ी / हिंदी में उपलब्ध"],
      toolsHeading: "आवेदन की तैयारी के लिए ज़रूरी सुविधाएं",
      toolsSubheading: "मोबाइल और कंप्यूटर पर आसान इस्तेमाल के लिए चार सीधे विकल्प।",
      showcaseEyebrow: "हर बुवाई और कटाई के साथ",
      showcaseTitle: "खेत की जुताई से लेकर योजना की तैयारी तक।",
      showcaseSubtitle:
        "चाहे खरीफ में धान की रोपाई की तैयारी हो या रबी में गेहूँ की कटाई, समय से पहले अपनी पात्रता और ज़रूरी कागज़ात तैयार रखें।",
      showcaseImageAlt: "बुवाई के मौसम में हरे-भरे खेत में दो सफ़ेद बैलों के साथ हल चलाता भारतीय किसान",
      showcaseCaptionTitle: "खरीफ और रबी बुवाई की तैयारी",
      showcaseCaptionText: "समयसीमा से पहले भूमि अभिलेख, बैंक पासबुक और फसल विवरण तैयार रखें।",
      showcaseSteps: [
        {
          number: "01",
          title: "अपनी ज़रूरत के अनुसार योजनाएं चुनें",
          text: "आर्थिक सहायता, सिंचाई, कृषि यंत्र और फसल बीमा श्रेणियों की तुलना करें।",
        },
        {
          number: "02",
          title: "कुछ ही सेकंड में सैंपल पात्रता जांचें",
          text: "आधार, बैंक खाता या पासवर्ड के बिना 5 आसान सवालों से जानकारी पाएं।",
        },
        {
          number: "03",
          title: "आवेदन से पहले दस्तावेज़ व्यवस्थित करें",
          text: "अपने PDF और फोटो सुरक्षित रूप से देखें और आवेदन की स्थिति समझें।",
        },
      ],
      showcaseCta: "दस्तावेज़ सूची तैयार करें",
      features: {
        schemes: { title: "योजनाएं देखें", text: "श्रेणी के अनुसार सैंपल योजनाएं देखें।" },
        eligibility: { title: "पात्रता जांचें", text: "5 आसान सवालों के जवाब दें।" },
        checklist: { title: "दस्तावेज़ सूची", text: "तैयार दस्तावेज़ों पर निशान लगाएं।" },
        status: { title: "आवेदन की स्थिति", text: "सैंपल आवेदन की प्रगति देखें।" },
      },
    },
    categories: {
      "All Schemes": "सभी योजनाएं",
      "Financial Support": "आर्थिक सहायता",
      Agriculture: "खेती-बाड़ी",
      Irrigation: "सिंचाई",
      Equipment: "कृषि उपकरण",
      Insurance: "फसल बीमा",
    },
    schemesPage: {
      title: "सरकारी योजनाएं देखें",
      subtitle: "अपनी खेती की ज़रूरत के अनुसार योजनाएं खोजें।",
      searchPlaceholder: "योजना का नाम या शब्द लिखकर खोजें",
      searchAriaLabel: "योजनाएं खोजें",
      demoBadge: "उदाहरण के लिए सैंपल योजनाएं",
      whoCanBenefit: "किसे लाभ मिल सकता है:",
      viewDetails: "विवरण देखें",
      emptyState: "कोई योजना नहीं मिली। कृपया दूसरा शब्द लिखकर खोजें।",
    },
    schemeDetailPage: {
      backToSchemes: "सभी योजनाओं पर वापस जाएं",
      overview: "योजना का परिचय",
      whoCanBenefit: "कौन लाभ ले सकता है",
      sampleBenefits: "सैंपल लाभ",
      howToApply: "आवेदन कैसे करें",
      requiredDocuments: "ज़रूरी दस्तावेज़",
      readyToCheck: "क्या आप जांच के लिए तैयार हैं?",
      readyToCheckText: "सैंपल परिणाम देखने के लिए कुछ आसान सवालों के जवाब दें।",
      checkEligibility: "पात्रता जांचें",
      documentChecklist: "दस्तावेज़ सूची",
    },
    schemesData: {
      "harit-kisan-sahayata": {
        name: "हरित किसान सहायता योजना",
        short: "छोटे और सीमांत किसान परिवारों के लिए सालाना आर्थिक सहायता का सैंपल।",
        beneficiaries: "छोटे और सीमांत किसान",
        overview:
          "यह एक उदाहरण योजना है जो दिखाती है कि सीधी आर्थिक सहायता से किसान परिवार बीज, खाद और मजदूरी जैसे मौसमी खर्च आसानी से पूरे कर सकते हैं।",
        whoCanBenefit: [
          "2 हेक्टेयर तक ज़मीन वाले छोटे किसान",
          "1 हेक्टेयर से कम ज़मीन वाले सीमांत किसान",
          "वैध ज़मीन के कागज़ वाले किसान",
        ],
        benefits: [
          "साल में ₹6,000 की सैंपल सहायता तीन किस्तों में",
          "रजिस्टर्ड बैंक खाते में सीधा पैसा",
          "किसी बिचौलिये की कोई ज़रूरत नहीं",
        ],
        documents: commonDocsHi,
        steps: [
          "किसानसारथी पर अपनी पात्रता जांचें",
          "ज़रूरी दस्तावेज़ तैयार रखें",
          "अपने नज़दीकी जन सेवा केंद्र (CSC) जाएं",
          "आवेदन फॉर्म जमा करें",
          "अपने आवेदन की स्थिति ट्रैक करें",
        ],
      },
      "beej-samriddhi": {
        name: "बीज समृद्धि मिशन",
        short: "रियायती दरों पर अच्छी गुणवत्ता वाले बीज देने का डेमो कार्यक्रम।",
        beneficiaries: "सभी पंजीकृत किसान",
        overview:
          "यह एक सैंपल योजना है जो बताती है कि स्थानीय कृषि कार्यालयों के माध्यम से कम दाम पर प्रमाणित और अधिक उपज वाले बीज कैसे मिल सकते हैं।",
        whoCanBenefit: [
          "किसी भी जोत वाले पंजीकृत किसान",
          "किसान उत्पादक समूह (FPO)",
          "दालें और तिलहन उगाने वाले किसान",
        ],
        benefits: [
          "प्रमाणित बीजों पर 50% तक की सैंपल सब्सिडी",
          "मुफ़्त मिट्टी जांच की सलाह",
          "मौसम के अनुसार फसल सलाह",
        ],
        documents: commonDocsHi,
        steps: [
          "पात्रता जांचें",
          "बीज मांग पत्र प्राप्त करें",
          "ज़रूरी दस्तावेज़ साथ लगाएं",
          "कृषि कार्यालय में फॉर्म जमा करें",
          "तय तारीख पर बीज प्राप्त करें",
        ],
      },
      "jal-bindu-sinchai": {
        name: "जल बिंदु सिंचाई योजना",
        short: "ड्रिप और स्प्रिंकलर सिंचाई सिस्टम के लिए सैंपल सहायता।",
        beneficiaries: "अपनी ज़मीन वाले किसान",
        overview:
          "यह एक उदाहरण योजना है जो दिखाती है कि पानी बचाने वाली सूक्ष्म सिंचाई प्रणाली किसानों के लिए किफ़ायती कैसे बनाई जा सकती है।",
        whoCanBenefit: [
          "खेती योग्य ज़मीन के मालिक किसान",
          "फल-सब्ज़ी (बागवानी) करने वाले किसान",
          "कम पानी वाले जिलों के किसान",
        ],
        benefits: [
          "छोटे किसानों के लिए 55% तक की सैंपल सब्सिडी",
          "सिस्टम लगाने के लिए तकनीकी मदद",
          "पानी और बिजली की कम खपत",
        ],
        documents: commonDocsHi,
        steps: [
          "पात्रता जांचें",
          "मान्यता प्राप्त विक्रेता से कोटेशन लें",
          "दस्तावेज़ों के साथ आवेदन जमा करें",
          "खेत का निरीक्षण (सत्यापन)",
          "सिस्टम लगवाना और सब्सिडी मिलना",
        ],
      },
      "yantra-mitra": {
        name: "यंत्र मित्र उपकरण योजना",
        short: "ट्रैक्टर, टिलर और खेती के औज़ार खरीदने के लिए डेमो योजना।",
        beneficiaries: "किसान और किसान समूह",
        overview:
          "यह सैंपल योजना दिखाती है कि आधुनिक कृषि मशीनें खरीदने में मदद मिलने से मेहनत कैसे कम होती है और पैदावार कैसे बढ़ती है।",
        whoCanBenefit: ["अकेले किसान", "स्वयं सहायता समूह (SHG)", "कस्टम हायरिंग सेंटर"],
        benefits: [
          "मंज़ूर कृषि यंत्रों पर 40% सैंपल सब्सिडी",
          "महिला किसानों को प्राथमिकता",
          "मशीन के सुरक्षित इस्तेमाल की ट्रेनिंग",
        ],
        documents: commonDocsHi,
        steps: [
          "पात्रता जांचें",
          "मंज़ूर कृषि उपकरण चुनें",
          "दस्तावेज़ों के साथ आवेदन करें",
          "मंज़ूरी पत्र प्राप्त करें",
          "उपकरण खरीदकर सब्सिडी का दावा करें",
        ],
      },
      "fasal-suraksha-kavach": {
        name: "फसल सुरक्षा कवच",
        short: "मौसम और कीटों से फसल नुकसान पर सैंपल बीमा सुरक्षा।",
        beneficiaries: "अधिसूचित फसल उगाने वाले किसान",
        overview:
          "यह एक उदाहरण बीमा योजना है जो बताती है कि कम प्रीमियम में किसान प्राकृतिक आपदाओं से अपनी फसल का बचाव कैसे कर सकते हैं।",
        whoCanBenefit: [
          "अधिसूचित फसलें उगाने वाले किसान",
          "किराये या बटाई पर खेती करने वाले किसान",
          "कर्ज़दार और बिना कर्ज़ वाले किसान",
        ],
        benefits: [
          "खरीफ फसलों के लिए मात्र 2% का कम सैंपल प्रीमियम",
          "सूखा, बाढ़ और कीटों से नुकसान पर सुरक्षा",
          "सीधे बैंक खाते में बीमा क्लेम की राशि",
        ],
        documents: commonDocsHi,
        steps: [
          "पात्रता जांचें",
          "तय अंतिम तारीख से पहले पंजीकरण करें",
          "सैंपल प्रीमियम जमा करें",
          "नुकसान होने पर 72 घंटे के अंदर सूचना दें",
          "क्लेम की राशि प्राप्त करें",
        ],
      },
      "kisan-saral-rin": {
        name: "किसान सरल ऋण कार्ड",
        short: "फसल और खेती की ज़रूरतों के लिए कम ब्याज वाला डेमो क्रेडिट कार्ड।",
        beneficiaries: "ज़मीन मालिक और बटाईदार किसान",
        overview:
          "यह सैंपल कर्ज सुविधा दिखाती है कि किसान खेती के काम के लिए कम ब्याज पर समय से छोटा कर्ज कैसे ले सकते हैं।",
        whoCanBenefit: ["अपनी ज़मीन पर खेती करने वाले किसान", "बटाईदार किसान", "पशुपालन करने वाले किसान"],
        benefits: [
          "समय पर भुगतान करने पर 4% की सैंपल ब्याज दर",
          "ज़रूरत के अनुसार पैसे निकालने की सुविधा",
          "दुर्घटना बीमा सुरक्षा शामिल",
        ],
        documents: commonDocsHi,
        steps: [
          "पात्रता जांचें",
          "सहयोगी बैंक शाखा में जाएं",
          "आवेदन फॉर्म भरें",
          "दस्तावेज़ जमा करें",
          "अपना किसान कार्ड प्राप्त करें",
        ],
      },
    },
    eligibilityPage: {
      title: "अपनी पात्रता जांचें",
      subtitle: "पांच आसान सवालों के जवाब दें। इसमें एक मिनट से भी कम समय लगता है।",
      selectPlaceholder: "-- चुनें --",
      requiredError: "यह जानकारी भरना ज़रूरी है।",
      requiredDocsLegend: "क्या ज़रूरी दस्तावेज़ उपलब्ध हैं?",
      requiredDocsHelp: "जैसे ज़मीन के कागज़, पहचान पत्र और बैंक पासबुक।",
      submitButton: "पात्रता जांचें",
      privacyTitle: "आपकी जानकारी सुरक्षित है",
      privacyText:
        "हम आपसे कभी भी आधार नंबर, बैंक खाते की जानकारी, OTP या पासवर्ड नहीं पूछते। इन्हें किसी भी अनजान व्यक्ति से साझा न करें।",
      states: {
        "Andhra Pradesh": "आंध्र प्रदेश",
        Bihar: "बिहार",
        Gujarat: "गुजरात",
        Haryana: "हरियाणा",
        Karnataka: "कर्नाटक",
        "Madhya Pradesh": "मध्य प्रदेश",
        Maharashtra: "महाराष्ट्र",
        Punjab: "पंजाब",
        Rajasthan: "राजस्थान",
        "Tamil Nadu": "तमिलनाडु",
        "Uttar Pradesh": "उत्तर प्रदेश",
        "West Bengal": "पश्चिम बंगाल",
      },
      fields: {
        state: {
          label: "राज्य चुनें",
          help: "वह राज्य चुनें जहाँ आपकी खेती की ज़मीन है।",
        },
        category: {
          label: "किसान श्रेणी",
          help: "सीमांत: 1 हेक्टेयर से कम। छोटे किसान: 1 से 2 हेक्टेयर।",
          options: {
            small: "छोटे किसान (लघु)",
            marginal: "सीमांत किसान",
            other: "अन्य",
          },
        },
        land: {
          label: "अनुमानित ज़मीन",
          help: "अंदाज़ा काफी है। 1 हेक्टेयर ≈ 2.5 एकड़।",
          options: {
            "below-1": "1 हेक्टेयर से कम",
            "1-2": "1 से 2 हेक्टेयर",
            "2-5": "2 से 5 हेक्टेयर",
            "above-5": "5 हेक्टेयर से अधिक",
          },
        },
        crop: {
          label: "फसल का प्रकार",
          help: "इस मौसम में उगाई जाने वाली मुख्य फसल चुनें।",
          options: {
            cereals: "अनाज (गेहूं, धान)",
            pulses: "दालें (दलहन)",
            oilseeds: "तिलहन",
            horticulture: "फल और सब्ज़ियां",
            cash: "नकदी फसलें (कपास, गन्ना)",
          },
        },
      },
      docOptions: {
        yes: "हाँ",
        no: "नहीं",
        "not-sure": "पक्का नहीं पता",
      },
    },
    resultPage: {
      previewLabel: "परिणाम के डिज़ाइन देखें:",
      whyResult: "यह परिणाम क्यों दिख रहा है",
      nextSteps: "अगले ज़रूरी कदम",
      rulesHeading: "इस परिणाम की जांच कैसे हुई (सैंपल नियम)",
      rulesIntro:
        "यह सैंपल चेकर आपके जवाबों की तुलना छोटे और सीमांत किसानों की सहायता योजनाओं के तीन आसान नियमों से करता है।",
      yourAnswer: "आपका जवाब:",
      notAnswered: "फॉर्म में जवाब नहीं भरा गया।",
      designPreviewNote: "यह केवल एक डिज़ाइन प्रीव्यू है। अपने जवाब देखने के लिए पात्रता जांच फॉर्म भरें।",
      disclaimer: "यह सैंपल जानकारी पर आधारित एक डेमो परिणाम है। यह कोई आधिकारिक सरकारी निर्णय नहीं है।",
      checkAgain: "फिर से जांचें",
      exploreOther: "अन्य योजनाएं देखें",
      outcomes: {
        match: {
          title: "संभावित पात्रता (मेल खाता है)",
          text: "आपके जवाबों के आधार पर आप सैंपल आर्थिक सहायता योजनाओं के लिए पात्र हो सकते हैं।",
          reasons: [
            "आपकी श्रेणी छोटे या सीमांत किसान की है",
            "आपकी ज़मीन सैंपल सीमा (5 हेक्टेयर या कम) के अंदर है",
            "आपने बताया कि आपके दस्तावेज़ तैयार हैं",
          ],
          steps: [
            "योजना का पूरा विवरण ध्यान से पढ़ें",
            "अपनी दस्तावेज़ सूची पूरी करें",
            "आवेदन के लिए नज़दीकी जन सेवा केंद्र पर जाएं",
          ],
          explanation: "तीनों सैंपल नियम पूरे हुए हैं, इसलिए संभावित मेल दिखाया गया है।",
        },
        "more-info": {
          title: "अधिक जानकारी चाहिए",
          text: "सैंपल मेल दिखाने से पहले आपके कुछ जवाबों में और जानकारी या सुधार की ज़रूरत है।",
          reasons: [
            "एक या अधिक जवाब नीचे दिए गए सैंपल नियमों से अलग हैं",
            "हो सकता है कुछ ज़रूरी दस्तावेज़ अभी उपलब्ध न हों",
          ],
          steps: [
            "जो दस्तावेज़ बाकी हैं उन्हें इकट्ठा करें",
            "अपने स्थानीय कृषि अधिकारी से बात करें",
            "दूसरी योजनाएं देखें जो आपके लिए बेहतर हों",
          ],
          explanation:
            "एक या अधिक जवाब ऊपर के सैंपल नियमों से अलग हैं, इसलिए मेल दिखाने से पहले और जानकारी चाहिए।",
        },
        insufficient: {
          title: "पर्याप्त जानकारी नहीं",
          text: "दी गई जानकारी के आधार पर हम सैंपल परिणाम नहीं दिखा सके।",
          reasons: [
            "एक या अधिक सवालों के जवाब अधूरे थे",
            "दस्तावेज़ उपलब्ध होने के बारे में स्थिति साफ़ नहीं थी",
          ],
          steps: [
            "जांचें कि घर पर कौन-कौन से दस्तावेज़ मौजूद हैं",
            "पात्रता फॉर्म फिर से भरें",
            "मदद के लिए परिवार के किसी सदस्य या जन सेवा केंद्र से पूछें",
          ],
          explanation:
            "कुछ जवाब छूटे हुए थे या 'पक्का नहीं पता' चुना गया था, इसलिए सैंपल नियमों की जांच नहीं हो सकी।",
        },
      },
      rules: {
        category: {
          label: "किसान की श्रेणी छोटे या सीमांत हो",
          detail: "यह सैंपल जांच छोटे और सीमांत किसान परिवारों के लिए है।",
        },
        land: {
          label: "ज़मीन 5 हेक्टेयर या उससे कम हो",
          detail: "1 हेक्टेयर लगभग 2.5 एकड़ होता है, यानी 5 हेक्टेयर लगभग 12.5 एकड़।",
        },
        documents: {
          label: "ज़रूरी दस्तावेज़ उपलब्ध हों",
          detail: "जैसे ज़मीन के कागज़, पहचान पत्र और बैंक पासबुक।",
        },
      },
      answerLabels: {
        category: {
          small: "छोटे किसान",
          marginal: "सीमांत किसान",
          other: "अन्य किसान",
        },
        land: {
          "below-1": "1 हेक्टेयर से कम",
          "1-2": "1 से 2 हेक्टेयर",
          "2-5": "2 से 5 हेक्टेयर",
          "above-5": "5 हेक्टेयर से अधिक",
        },
        documents: {
          yes: "दस्तावेज़ उपलब्ध हैं",
          no: "दस्तावेज़ उपलब्ध नहीं हैं",
          "not-sure": "अभी पक्का नहीं पता",
        },
      },
    },
    checklistPage: {
      title: "आपकी दस्तावेज़ सूची",
      subtitle: "जो दस्तावेज़ तैयार हो जाएं उन पर निशान (टिक) लगाते जाएं।",
      selectedScheme: "चुनी हुई योजना",
      sampleSchemeBadge: "सैंपल योजना",
      progressLabel: "तैयारी की स्थिति",
      completedSummary: (count, total) => `${total} में से ${count} दस्तावेज़ तैयार हैं`,
      resetButton: "सूची रीसेट करें",
      docs: [
        { name: "पहचान पत्र", note: "कोई भी सरकारी फोटो पहचान पत्र (सैंपल)" },
        { name: "ज़मीन का मालिकाना रिकॉर्ड", note: "खतौनी / भू-अभिलेख / नकल की कॉपी" },
        { name: "बैंक पासबुक की कॉपी", note: "पहला पन्ना जिस पर नाम और शाखा लिखी हो" },
        { name: "पासपोर्ट साइज फोटो", note: "हाल की रंगीन फोटो" },
        { name: "फसल बुवाई घोषणा पत्र", note: "बोई गई फसलों का स्व-घोषणा पत्र" },
      ],
    },
    uploads: {
      title: "दस्तावेज़ और फोटो अपलोड करें",
      subtitle: "अपने फ़ोन से PDF या फोटो चुनें।",
      previewOnlyNotice:
        "केवल देखने (प्रीव्यू) के लिए: फ़ाइलें सिर्फ़ आपके फ़ोन या कंप्यूटर में रहती हैं और कहीं भेजी या सेव नहीं होतीं। पेज बंद या रीलोड करने पर ये हट जाएंगी।",
      selectAriaLabel: "दस्तावेज़ और फोटो चुनें",
      uploadPdf: "PDF चुनें",
      uploadImage: "फोटो चुनें",
      dragDropPrompt: "अपनी फ़ाइलें यहाँ खींचकर छोड़ें",
      browseFiles: "फ़ाइलें चुनें",
      fileLimitHint: "PDF, JPG, JPEG या PNG · हर फ़ाइल अधिकतम 10 MB",
      dismissFileError: (name) => `${name} की त्रुटि हटाएं`,
      selectedFilesCount: (count) => `चुनी गई फ़ाइलें (${count})`,
      readyToPreview: "देखने के लिए तैयार · सेव नहीं हुई",
      preview: "देखें",
      replace: "बदलें",
      replaceAriaLabel: (name) => `${name} बदलें`,
      removeTitle: "फ़ाइल हटाएं",
      removeAriaLabel: (name) => `${name} हटाएं`,
      closePreview: "प्रीव्यू बंद करें",
      pdfFallback: "हो सकता है आपके फ़ोन में PDF सीधे न दिखे।",
      openPdf: "PDF खोलें",
      replacedMsg: (name) => `${name} से बदल दिया गया।`,
      addedMsg: (name) => `प्रीव्यू के लिए ${name} जोड़ा गया।`,
      removedMsg: (name) => `${name} हटा दिया गया।`,
      invalidTypeClient: "कृपया PDF, JPG, JPEG या PNG फ़ाइल चुनें।",
    },
    validation: {
      simpleFileName: "कृपया आसान फ़ाइल नाम इस्तेमाल करें।",
      maxFileSize: "हर फ़ाइल 10 MB या उससे छोटी होनी चाहिए।",
      invalidFileChoice: "कृपया आसान नाम वाली PDF, JPG, JPEG, PNG या WEBP फ़ाइल चुनें।",
      typeMismatch: "फ़ाइल का प्रकार उसके नाम से मेल नहीं खाता। कृपया सही PDF या फोटो चुनें।",
      invalidContent: "यह सही PDF या फोटो फ़ाइल नहीं है। कृपया दूसरी फ़ाइल चुनें।",
    },
    statusPage: {
      title: "आवेदन की स्थिति",
      subtitle: "अपने योजना आवेदनों की प्रगति देखें।",
      demoBanner: "यहाँ दिखाए गए सभी आवेदन रिकॉर्ड केवल उदाहरण (डेमो) के लिए हैं।",
      appliedOnPrefix: "आवेदन तिथि:",
      statuses: {
        draft: "ड्राफ्ट (अधूरा)",
        prepared: "तैयार",
        submitted: "जमा किया गया (डेमो)",
        "update-needed": "सुधार ज़रूरी",
      },
      actions: {
        draft: "आगे बढ़ाएं",
        prepared: "विवरण देखें",
        submitted: "विवरण देखें",
        "update-needed": "जांच करें",
      },
    },
    statusDetailPage: {
      backToStatus: "आवेदन की स्थिति पर वापस जाएं",
      demoRecordBadge: "उदाहरण (डेमो) रिकॉर्ड",
      appliedOnPrefix: "आवेदन तिथि:",
      demoDisclaimer:
        "यह आवेदन रिकॉर्ड केवल दिखाने के लिए है। यहाँ कुछ भी असली आवेदन नहीं है और कोई जानकारी सेव नहीं होती।",
      continueTitle: "अपना आवेदन पूरा करें",
      continueSubtitle: "जैसे-जैसे चरण पूरे हों, उन पर टिक लगाएं। यह सिर्फ़ डेमो सूची है — कुछ भी सेव या जमा नहीं होता।",
      stepsTicked: (done, total) => `इस डेमो में ${total} में से ${done} चरण पूरे किए गए।`,
      openEligibility: "पात्रता चेकर खोलें",
      documentChecklist: "दस्तावेज़ सूची",
      actionRequired: "सुधार ज़रूरी है",
      markedCorrectedDemo: "इस डेमो में सुधारा गया चिह्नित किया गया (असल में कोई फ़ाइल अपलोड नहीं हुई)।",
      markCorrectedBtn: "सुधारा गया चिह्नित करें (डेमो)",
      readyForSubmission: "जमा करने के लिए तैयार",
      underReview: "जांच जारी है",
      whatHappensNext: "आगे क्या होगा",
      progressTimeline: "आवेदन की प्रगति",
      currentStepBadge: "मौजूदा चरण",
      applicationSummary: "आवेदन का सारांश",
      referenceLabel: "संदर्भ संख्या",
      statusLabel: "स्थिति",
      appliedOnLabel: "आवेदन तिथि",
      schemeLabel: "योजना",
      viewSchemeDetails: "योजना का विवरण देखें",
      documentsForApp: "इस आवेदन के दस्तावेज़",
      openDocumentChecklist: "दस्तावेज़ सूची खोलें",
    },
    applicationsData: {
      "KS-DEMO-0001": {
        appliedOn: "01 जन 2099 (डेमो)",
        desc: "आपका आवेदन सेव है लेकिन अभी पूरा नहीं हुआ है।",
        timeline: ["आवेदन शुरू हुआ", "जानकारी और दस्तावेज़ पूरे करें", "जांच के लिए जमा करें"],
        remainingSteps: [
          "किसान और ज़मीन की जानकारी भरें",
          "बैंक खाते की जानकारी की पुष्टि करें",
          "ज़मीन के कागज़ (खतौनी) की कॉपी लगाएं",
          "सब कुछ जांचकर आवेदन जमा करें",
        ],
      },
      "KS-DEMO-0002": {
        appliedOn: "15 फर 2099 (डेमो)",
        desc: "सारी जानकारी और दस्तावेज़ जमा करने के लिए तैयार हैं।",
        timeline: [
          "आवेदन शुरू हुआ",
          "जानकारी पूरी हुई",
          "दस्तावेज़ जोड़े गए",
          "जमा करने के लिए तैयार",
          "जांच और सत्यापन",
        ],
        nextSteps: [
          "अपने नज़दीकी जन सेवा केंद्र पर आवेदन जमा करें",
          "खेत के सत्यापन के लिए अधिकारी आ सकते हैं",
          "मंज़ूरी के बाद विक्रेता सिस्टम लगाएगा और सब्सिडी जारी होगी",
        ],
      },
      "KS-DEMO-0003": {
        appliedOn: "10 मार 2099 (डेमो)",
        desc: "आपका सैंपल आवेदन जांच के लिए जमा कर दिया गया है।",
        timeline: [
          "आवेदन शुरू हुआ",
          "जानकारी पूरी हुई",
          "दस्तावेज़ जोड़े गए",
          "जांच के लिए जमा हुआ",
          "विभाग द्वारा जांच जारी",
          "निर्णय और पंजीकरण की पुष्टि",
        ],
        nextSteps: [
          "विभाग आपकी फसल और ज़मीन के विवरण की जांच करता है",
          "पंजीकरण मंज़ूर होने पर आपको पुष्टि मिल जाएगी",
          "मंज़ूरी के बाद किसी भी फसल नुकसान की सूचना 72 घंटे में दें",
        ],
      },
      "KS-DEMO-0004": {
        appliedOn: "22 अप्रै 2099 (डेमो)",
        desc: "एक दस्तावेज़ को दोबारा अपलोड करने या सुधारने की ज़रूरत है।",
        timeline: [
          "आवेदन शुरू हुआ",
          "जानकारी पूरी हुई",
          "दस्तावेज़ जोड़े गए",
          "जांच के लिए जमा हुआ",
          "चिह्नित दस्तावेज़ को ठीक करें",
          "दोबारा जमा और जांच",
        ],
        flaggedDoc: "उपकरण कोटेशन पत्र",
        flaggedReason:
          "अपलोड की गई कॉपी साफ़ दिखाई नहीं दे रही है। कृपया मान्यता प्राप्त विक्रेता द्वारा जारी कोटेशन पत्र की साफ़ कॉपी अपलोड करें।",
        nextSteps: [
          "चिह्नित दस्तावेज़ को सुधारें या दोबारा अपलोड करें",
          "आवेदन फिर से जांच के लिए कतार में जाएगा",
          "जांच पूरी होने पर आपको मंज़ूरी पत्र मिल जाएगा",
        ],
      },
    },
    assistant: {
      askAiButton: "AI से पूछें",
      askAiAriaLabel: "खेती सहायक AI से पूछें",
      subtitle: "किसानसारथी · AI",
      closeAriaLabel: "बंद करें",
      stopGeneratingAriaLabel: "रोकें",
      sendMessageAriaLabel: "भेजें",
      welcome: "नमस्ते! आपके खेती सहायक में आपका स्वागत है। हिंदी, अंग्रेज़ी या हिंग्लिश में पूछें।",
      placeholder: "हिंदी, अंग्रेज़ी या हिंग्लिश में सवाल लिखें या बोलें…",
      thinking: "सोच रहा हूँ…",
      listen: "सुनें",
      pause: "रोकें (Pause)",
      resume: "आगे सुनें",
      replay: "फिर से सुनें",
      stop: "बंद करें",
      loadingAudio: "आवाज़ तैयार हो रही है…",
      speaking: "बोल रहा हूँ…",
      paused: "रुका हुआ",
      clear: "चैट साफ़ करें",
      mic: "बोलकर पूछें",
      micOff: "सुनना बंद करें",
      listening: "सुन रहा हूँ… अब बोलें (भेजने से पहले सुधार कर सकते हैं)",
      listeningHindi: "हिंदी में सुन रहा हूँ… अब बोलें",
      listeningEnglish: "अंग्रेज़ी में सुन रहा हूँ… अब बोलें",
      noMic: "इस ब्राउज़र में बोलकर पूछने की सुविधा उपलब्ध नहीं है। कृपया अपना सवाल लिखें।",
      noMicHardware: "कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक जोड़ें या अपना सवाल लिखें।",
      micNetworkError: "आवाज़ पहचानने में नेटवर्क समस्या आई। कृपया फिर से बोलें या लिखकर पूछें।",
      denied: "माइक्रोफ़ोन की अनुमति बंद है। ब्राउज़र सेटिंग में माइक चालू करें, या सवाल लिखें।",
      noSpeech: "कुछ सुनाई नहीं दिया। कृपया साफ़ बोलें और फिर कोशिश करें।",
      noVoice: "इस ब्राउज़र में बोलकर जवाब सुनाने की सुविधा उपलब्ध नहीं है।",
      noHindiVoiceFallback: "इस डिवाइस पर अलग से हिंदी आवाज़ उपलब्ध नहीं मिली; सिस्टम डिफ़ॉल्ट से सुनाने की कोशिश की जा रही है।",
      noEnglishVoiceFallback: "इस डिवाइस पर अलग से अंग्रेज़ी आवाज़ उपलब्ध नहीं मिली; सिस्टम डिफ़ॉल्ट से सुनाने की कोशिश की जा रही है।",
      voiceModeLabel: "आवाज़ मोड",
      voiceModeTextOnly: "केवल टेक्स्ट",
      voiceModeAuto: "टेक्स्ट + अपने-आप आवाज़",
      voiceModeOnDemand: "सुनें बटन से",
      note: "AI की सलाह सामान्य जानकारी है और गलत भी हो सकती है। मिट्टी की जांच कराएं और नज़दीकी KVK या कृषि अधिकारी से सलाह लें।",
      suggestions: [
        "मिट्टी की उर्वरता कैसे बढ़ाएं?",
        "फसल के पत्ते पीले क्यों हो रहे हैं?",
        "कौन सा खाद इस्तेमाल करना चाहिए?",
        "फसल में कीटों को कैसे नियंत्रित करें?",
      ],
      title: "खेती सहायक",
      error402: "AI सेवा की सीमा पूरी हो गई है। कृपया बाद में प्रयास करें।",
      error429: "बहुत सारे सवाल एक साथ आए। थोड़ी देर बाद पूछें।",
      errorGeneric: "जवाब नहीं मिल पाया। इंटरनेट जाँचें और फिर से भेजें।",
    },
    accessibility: {
      skipToContent: "मुख्य सामग्री पर जाएं",
      triggerLabel: "सुगम्यता",
      triggerAriaLabel: "सुगम्यता और डिस्प्ले सेटिंग्स खोलें",
      panelTitle: "सुगम्यता और डिस्प्ले सेटिंग्स",
      panelSubtitle: "सभी पेजों के लिए टेक्स्ट, रंग, पढ़ने की गाइड और एनीमेशन अपनी सुविधा अनुसार बदलें।",
      closePanel: "सुगम्यता पैनल बंद करें",
      resetAll: "डिफ़ॉल्ट पर रीसेट करें",
      activeCountLabel: (count) => (count === 0 ? "डिफ़ॉल्ट सेटिंग सक्रिय" : `${count} सेटिंग सक्रिय`),
      osMatchButton: "सिस्टम सेटिंग लागू करें",
      osStatusNote: (motion, dark, contrast) => {
        const parts: string[] = [];
        if (motion) parts.push("कम एनीमेशन");
        if (dark) parts.push("डार्क थीम");
        if (contrast) parts.push("ज़्यादा कंट्रास्ट");
        return parts.length > 0 ? `डिवाइस की प्राथमिकता मिली: ${parts.join(", ")}` : "कोई विशेष सिस्टम डिस्प्ले प्राथमिकता नहीं मिली।";
      },
      tabs: {
        text: "टेक्स्ट व डिस्लेक्सिया",
        color: "रंग व कंट्रास्ट",
        assist: "गति व फ़ोकस",
      },
      preview: {
        title: "लाइव झलक",
        headingSample: "पीएम-किसान योजना मार्गदर्शन",
        bodySample: "टेक्स्ट का आकार, फ़ॉन्ट, लाइन दूरी या रंग बदलें और बिना किसी रुकावट के तुरंत असर देखें।",
        linkSample: "योजना की पात्रता जांचें",
      },
      textSize: {
        sectionTitle: "टेक्स्ट का आकार और स्केल",
        bodySizeLabel: "मुख्य टेक्स्ट का आकार",
        bodySizeDesc: "पैराग्राफ़, लेबल और फ़ॉर्म टेक्स्ट को 12px से 32px तक स्वतंत्र रूप से बदलें।",
        decreaseBtn: "A-",
        defaultBtn: "A",
        increaseBtn: "A+",
        defaultTag: "डिफ़ॉल्ट",
        headingScaleLabel: "शीर्षक (Heading) का आकार",
        headingScaleDesc: "पेज के बड़े शीर्षकों का आकार मुख्य टेक्स्ट से अलग बदलें।",
        interfaceScaleLabel: "पूरा इंटरफ़ेस स्केल",
        interfaceScaleDesc: "कार्ड, बटन और पूरे पेज का अनुपात एक साथ बड़ा या छोटा करें।",
        enlargeControlsLabel: "मेनू और बटन बड़े करें",
        enlargeControlsDesc: "नेविगेशन लिंक, बटन और चेकबॉक्स को दबाने में आसान व बड़ा बनाता है।",
      },
      dyslexia: {
        sectionTitle: "डिस्लेक्सिया और पढ़ने की सुविधा",
        readingLinksTitle: "पढ़ना और लिंक",
        dyslexiaModeLabel: "डिस्लेक्सिया मोड",
        dyslexiaModeDesc:
          "डिस्लेक्सिया-अनुकूल फ़ॉन्ट, आरामदायक टेक्स्ट दूरी, बाईं ओर संरेखण, हल्का क्रीम बैकग्राउंड और साफ़ लेआउट एक साथ लागू करता है।",
        textSpaceLabel: "टेक्स्ट स्पेस (दूरी)",
        textSpaceDesc: "अक्षरों, शब्दों और पंक्तियों के बीच की दूरी चालू या बंद करता है।",
        fontFamilyLabel: "फ़ॉन्ट स्टाइल",
        fontFamilyDesc: "डिफ़ॉल्ट, डिस्लेक्सिया-अनुकूल या साफ़ दिखने वाले फ़ॉन्ट चुनें।",
        fonts: {
          default: "डिफ़ॉल्ट (Poppins)",
          dyslexic: "डिस्लेक्सिया-अनुकूल (Lexend)",
          arial: "Arial",
          verdana: "Verdana",
          "open-sans": "Open Sans",
        },
        letterSpacingLabel: "अक्षरों के बीच दूरी",
        letterSpacingDesc: "अक्षरों को अलग-अलग साफ़ पढ़ने के लिए दूरी बढ़ाएं।",
        wordSpacingLabel: "शब्दों के बीच दूरी",
        wordSpacingDesc: "शब्दों के बीच स्पष्ट अंतर रखने के लिए दूरी बढ़ाएं।",
        lineHeightLabel: "पंक्तियों (Line) की दूरी",
        lineHeightDesc: "टेक्स्ट की दो लाइनों के बीच की ऊँचाई बदलें।",
        leftAlignLabel: "टेक्स्ट को बाईं ओर संरेखित करें",
        leftAlignDesc: "बीच में लिखे टेक्स्ट को पढ़ने में आसान बनाने के लिए बाईं ओर लाता है।",
        reducedClutterLabel: "कम दृश्य सजावट (Clean view)",
        reducedClutterDesc: "अतिरिक्त परछाई, ग्रेडिएंट और सजावटी कैप्शन छिपाता है।",
        readingRulerLabel: "रीडिंग रूलर (पढ़ने की पट्टी)",
        readingRulerDesc: "माउस या कीबोर्ड फ़ोकस के साथ चलने वाली पढ़ने की गाइड लाइन दिखाता है।",
      },
      color: {
        sectionTitle: "रंग और कंट्रास्ट मोड",
        presetsLabel: "डिस्प्ले और कलर-विज़न मोड",
        presetsDesc: "डार्क/लाइट, कम चमक, हाई कंट्रास्ट और कलर-ब्लाइंडनेस के लिए अनुकूलित थीम।",
        modes: {
          default: "साइट डिफ़ॉल्ट",
          light: "लाइट मोड",
          dark: "डार्क मोड",
          "high-contrast": "हाई कंट्रास्ट",
          "low-contrast": "लो कंट्रास्ट",
          cream: "वॉर्म क्रीम",
          protanopia: "प्रोटैनोपिया अनुकूल",
          deuteranopia: "ड्यूटेरानोपिया अनुकूल",
          tritanopia: "ट्राइटैनोपिया अनुकूल",
        },
        customColorsTitle: "कस्टम टेक्स्ट और बैकग्राउंड रंग",
        customColorsDesc: "लाइव WCAG कंट्रास्ट जांच के साथ अपने पसंदीदा टेक्स्ट और बैकग्राउंड रंग चुनें।",
        enableCustomColors: "कस्टम रंग लागू करें",
        textColorLabel: "टेक्स्ट का रंग",
        bgColorLabel: "बैकग्राउंड का रंग",
        contrastRatioLabel: "कंट्रास्ट अनुपात",
        contrastPassAa: "WCAG AA मानक पूरा",
        contrastPassAaa: "WCAG AAA मानक पूरा",
        contrastLowWarn: "कम कंट्रास्ट (4.5:1+ बेहतर है)",
        inversionTitle: "रंग उलटना (Color Inversion)",
        invertColorsLabel: "वेबसाइट के रंग उलटें",
        invertColorsDesc: "पूरी वेबसाइट के हल्के और गहरे रंगों को उलट देता है।",
        preserveImagesLabel: "फ़ोटो और वीडियो के असली रंग बचाएं",
        preserveImagesDesc: "रंग उलटने पर भी तस्वीरों और वीडियो को उनके प्राकृतिक रंगों में रखता है।",
      },
      assist: {
        sectionTitle: "एनीमेशन, लिंक और कीबोर्ड सहायता",
        reduceAnimationsLabel: "एनीमेशन और ट्रांज़िशन कम करें",
        reduceAnimationsDesc: "चलते प्रभाव और स्लाइड एनीमेशन बंद करता है (डिवाइस प्राथमिकता का भी सम्मान करता है)।",
        highlightLinksLabel: "सभी लिंक को हाईलाइट करें",
        highlightLinksDesc: "क्लिक करने योग्य लिंक पर गहरी रेखा और बॉर्डर दिखाता है।",
        highlightFocusLabel: "कीबोर्ड फ़ोकस स्पष्ट दिखाएं",
        highlightFocusDesc: "Tab कुंजी से चलने पर फ़ोकस के चारों ओर स्पष्ट डबल रिंग दिखाता है।",
        wcagNote: "आपकी सेटिंग्स इस ब्राउज़र में अपने-आप सुरक्षित रहती हैं और हर पेज पर लागू होती हैं।",
      },
    },
  },
};
