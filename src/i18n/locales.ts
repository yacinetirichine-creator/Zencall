export const LOCALES = [
  "en", // English
  "zh", // 中文 (Mandarin)
  "hi", // हिन्दी
  "es", // Español
  "fr", // Français
  "ar", // العربية
  "bn", // বাংলা
  "pt", // Português
  "ru", // Русский
  "ur", // اردو
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const RTL_LOCALES = new Set<Locale>(["ar", "ur"]);

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  bn: "বাংলা",
  pt: "Português",
  ru: "Русский",
  ur: "اردو",
};
