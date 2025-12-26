import { cookies } from "next/headers";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { isLocale, LOCALE_COOKIE } from "./runtime";

export function getLocaleFromCookies(): Locale {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;
  return DEFAULT_LOCALE;
}
