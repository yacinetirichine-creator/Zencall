"use client";

import * as React from "react";
import type { Locale } from "./locales";
import type { Messages } from "./messages";
import { createTranslator } from "./runtime";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  const t = React.useMemo(() => createTranslator(messages), [messages]);
  const value = React.useMemo(() => ({ locale, messages, t }), [locale, messages, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
