import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/shared/lib/i18n/constants";
import { getLocaleFromValue } from "@/shared/lib/i18n/get-locale-from-value";
import { getLocalizedPathname } from "@/shared/lib/i18n/get-localized-pathname";
import type { Locale } from "@/shared/lib/i18n/types";

type GetRequiredLocaleParams = {
  locale: string | null | undefined;
  fallbackPathname?: string;
};

export function getRequiredLocale({
  locale,
  fallbackPathname = "/",
}: GetRequiredLocaleParams): Locale {
  const resolvedLocale = getLocaleFromValue({ locale });

  if (resolvedLocale) {
    return resolvedLocale;
  }

  redirect(
    getLocalizedPathname({
      locale: DEFAULT_LOCALE,
      pathname: fallbackPathname,
    }),
  );
}
