import type { Locale } from "@/shared/lib/i18n/types";

export const LOCALES = ["en", "es"] as const;
export const DEFAULT_LOCALE: Locale = "en";
export const PREFERRED_LOCALE_COOKIE = "preferred-locale";
