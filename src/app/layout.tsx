import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { I18nProvider } from "@/i18n/provider";
import { getMessages, createTranslator } from "@/i18n/runtime";
import { getLocaleFromCookies } from "@/i18n/server";
import { RTL_LOCALES } from "@/i18n/locales";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocaleFromCookies();
  const t = createTranslator(getMessages(locale));
  return {
    title: { default: t("common.appName"), template: `%s | ${t("common.appName")}` },
    description: t("landing.heroBody"),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocaleFromCookies();
  const messages = getMessages(locale);
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen">
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
