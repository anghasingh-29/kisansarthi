export type AssistantLanguage = "en" | "hi";

const DEVANAGARI_REGEX = /[\u0900-\u097F]/;

// Unambiguous Romanized Hindi (Hinglish) words commonly used by farmers.
const STRONG_HINGLISH_WORDS = new Set([
  "kya",
  "kaise",
  "kaisa",
  "kaisi",
  "kaun",
  "konsa",
  "konsi",
  "kyon",
  "kyun",
  "kyu",
  "kab",
  "kahan",
  "kaha",
  "kitna",
  "kitni",
  "kitne",
  "mera",
  "meri",
  "mere",
  "hamara",
  "hamari",
  "hamare",
  "humara",
  "aapka",
  "aapki",
  "aapke",
  "tumhara",
  "fasal",
  "kheti",
  "khet",
  "mitti",
  "miti",
  "khad",
  "khaad",
  "sinchai",
  "sichai",
  "patte",
  "patti",
  "pattiyan",
  "peele",
  "peela",
  "peeli",
  "pile",
  "keede",
  "keeda",
  "kida",
  "kide",
  "bimari",
  "beemari",
  "rog",
  "batao",
  "bataiye",
  "bataye",
  "batayein",
  "chahiye",
  "chahie",
  "karna",
  "karein",
  "karen",
  "karu",
  "karun",
  "daale",
  "daalna",
  "dalna",
  "dale",
  "dalen",
  "lag",
  "gaye",
  "gaya",
  "gayi",
  "raha",
  "rahi",
  "rahe",
  "hain",
  "hoon",
  "nahi",
  "nahin",
  "nhi",
  "mat",
  "accha",
  "achha",
  "theek",
  "thik",
  "dhanyavaad",
  "dhanyawad",
  "shukriya",
  "gehu",
  "gehun",
  "dhan",
  "dhaan",
  "chawal",
  "aloo",
  "aaloo",
  "pyaz",
  "tamatar",
  "ganna",
  "kapas",
  "makka",
  "bajra",
  "jowar",
  "sarson",
  "chana",
  "moong",
  "urad",
  "arhar",
  "masoor",
  "bhaiya",
  "samasya",
  "upay",
  "upaay",
  "ilaj",
  "ilaaj",
  "dawa",
  "dawai",
  "dawaiya",
  "kitnashak",
  "keetnashak",
  "urvarak",
  "urvarata",
  "paani",
  "pani",
  "beej",
  "bij",
  "buaai",
  "buwai",
  "katai",
  "sarkari",
  "paisa",
  "paise",
  "madad",
  "sahayata",
  "krishi",
  "kisan",
  "yojana",
  "namaste",
  "namaskar",
  "hai",
]);

// Words that are also valid English words or common loanwords in English queries
// (e.g., "Tell me about Kisan Yojana", "Namaste, how do I improve soil?").
const CONTEXTUAL_HINDI_LOANWORDS = new Set(["kisan", "yojana", "namaste", "namaskar"]);

const SECONDARY_HINGLISH_WORDS = new Set([
  "mein",
  "ke",
  "ki",
  "ka",
  "ko",
  "se",
  "liye",
  "wala",
  "wali",
  "wale",
  "karo",
  "dekho",
  "sakta",
  "sakti",
  "sakte",
  "hota",
  "hoti",
  "hote",
  "hua",
  "hui",
  "hue",
  "apni",
  "apne",
  "apna",
  "aur",
  "bhi",
  "bahut",
  "zyada",
  "jyada",
  "kam",
  "isme",
  "usme",
  "kaise",
]);

const ENGLISH_SIGNAL_WORDS = new Set([
  "what",
  "which",
  "how",
  "why",
  "when",
  "where",
  "who",
  "should",
  "could",
  "would",
  "can",
  "does",
  "did",
  "do",
  "is",
  "are",
  "am",
  "was",
  "were",
  "will",
  "have",
  "has",
  "had",
  "the",
  "this",
  "that",
  "these",
  "those",
  "my",
  "your",
  "our",
  "their",
  "for",
  "with",
  "from",
  "about",
  "into",
  "please",
  "tell",
  "explain",
  "improve",
  "increase",
  "control",
  "prevent",
  "protect",
  "treat",
  "apply",
  "crop",
  "crops",
  "soil",
  "fertility",
  "fertilizer",
  "fertilizers",
  "pesticide",
  "pests",
  "pest",
  "leaves",
  "leaf",
  "yellow",
  "turning",
  "water",
  "irrigation",
  "seed",
  "seeds",
  "scheme",
  "schemes",
  "farmer",
  "farmers",
  "farming",
  "wheat",
  "rice",
  "weather",
  "rain",
]);

export function containsDevanagari(text: string): boolean {
  return DEVANAGARI_REGEX.test(text);
}

/**
 * Automatically detects whether a message is Hindi (Devanagari or Hinglish)
 * or English, while preserving the previous conversation language for ambiguous
 * or very short inputs (e.g. "OK", "NPK", "PM-KISAN").
 */
export function detectConversationLanguage(
  text: string,
  previousLang: AssistantLanguage = "en",
): AssistantLanguage {
  const trimmed = text.trim();
  if (!trimmed) return previousLang;

  if (containsDevanagari(trimmed)) {
    return "hi";
  }

  const tokens = trimmed
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z]+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return previousLang;
  }

  let strongHindiHits = 0;
  let contextualLoanwordHits = 0;
  let secondaryHindiHits = 0;
  let englishHits = 0;

  for (const token of tokens) {
    if (CONTEXTUAL_HINDI_LOANWORDS.has(token)) {
      contextualLoanwordHits++;
    } else if (STRONG_HINGLISH_WORDS.has(token)) {
      strongHindiHits++;
    } else if (SECONDARY_HINGLISH_WORDS.has(token)) {
      secondaryHindiHits++;
    }
    if (ENGLISH_SIGNAL_WORDS.has(token)) {
      englishHits++;
    }
  }

  // Clear Hinglish grammar or farming words -> Hindi
  if (strongHindiHits >= 1 && (englishHits === 0 || strongHindiHits + secondaryHindiHits >= englishHits)) {
    return "hi";
  }
  if (strongHindiHits >= 2 || (strongHindiHits >= 1 && secondaryHindiHits >= 1)) {
    return "hi";
  }
  if (secondaryHindiHits >= 2 && englishHits === 0) {
    return "hi";
  }
  if (contextualLoanwordHits >= 1 && englishHits === 0 && tokens.length <= 3) {
    return "hi";
  }

  // Clear English message -> English
  if (englishHits >= 1 && strongHindiHits === 0 && secondaryHindiHits === 0) {
    return "en";
  }

  // Ambiguous / neutral input -> preserve conversation language
  return previousLang;
}

/**
 * Detects language of a rendered text message (primarily for TTS voice selection).
 * Any Devanagari content selects Hindi; otherwise checks Hinglish/English with fallback.
 */
export function detectTextLanguage(
  text: string,
  fallbackLang: AssistantLanguage = "en",
): AssistantLanguage {
  return detectConversationLanguage(text, fallbackLang);
}
