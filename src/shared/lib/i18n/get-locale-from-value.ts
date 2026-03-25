import { LOCALES } from "@/shared/lib/i18n/constants";
import type { Locale } from "@/shared/lib/i18n/types";

type GetLocaleFromValueParams = {
  locale: string | null | undefined;
};

const localeSet = new Set<string>(LOCALES);

function isValidLocale(locale: string): locale is Locale {
  return localeSet.has(locale);
}

export function getLocaleFromValue({
  locale,
}: GetLocaleFromValueParams): Locale | null {
  if (!locale) {
    return null;
  }

  const normalizedLocale = locale.toLowerCase();

  return isValidLocale(normalizedLocale) ? normalizedLocale : null;
}
