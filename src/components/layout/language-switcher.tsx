"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/locales";
import { useI18n } from "@/i18n/provider";

export function LanguageSwitcher({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [isPending, startTransition] = useTransition();

  const options = LOCALES.map((value) => ({ value, label: LOCALE_LABELS[value] }));

  const onChange = (nextLocaleRaw: string) => {
    const nextLocale = nextLocaleRaw as Locale;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      router.refresh();
    });
  };

  return (
    <Select
      className={className}
      label={showLabel ? t("common.language") : undefined}
      options={options}
      value={locale}
      onChange={onChange}
      placeholder={isPending ? "…" : undefined}
    />
  );
}
