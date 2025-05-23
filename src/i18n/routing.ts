// src/i18n/routing.ts

export const locales = ['en', 'bn', 'es', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
  es: 'Spanish',
  ar: "Arabic"
};

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}
