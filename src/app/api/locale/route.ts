import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/i18n/runtime";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const locale = body?.locale;

  if (!isLocale(locale)) {
    return NextResponse.json({ ok: false, error: "invalid_locale" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
