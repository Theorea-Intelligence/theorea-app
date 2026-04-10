export const SUPPORTED_LOCALES = ["en", "fr", "it", "zh"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  it: "Italiano",
  zh: "中文",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  it: "🇮🇹",
  zh: "🇨🇳",
};

/** Map a browser language tag to one of our supported locales */
export function detectLocale(browserLang: string): Locale {
  const code = browserLang.toLowerCase().split("-")[0];
  if (code === "fr") return "fr";
  if (code === "it") return "it";
  if (code === "zh") return "zh";
  return "en";
}
