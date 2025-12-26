import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";
import { messagesByLocale, type Messages } from "./messages";

export const LOCALE_COOKIE = "zencall_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) return false;
  return (LOCALES as readonly string[]).includes(value);
}

function getPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? messagesByLocale[DEFAULT_LOCALE];
}

export function createTranslator(messages: Messages) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const value = getPath(messages, key);
    if (typeof value === "string") return interpolate(value, params);
    return key;
  };
}
