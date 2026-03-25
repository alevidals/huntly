import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/lib/i18n/constants";
import { getLocaleFromValue } from "@/shared/lib/i18n/get-locale-from-value";
import type { Locale } from "@/shared/lib/i18n/types";

type GetLocaleFromBrowserParams = {
  request: NextRequest;
};

export function getLocaleFromBrowser({
  request,
}: GetLocaleFromBrowserParams): Locale {
  const negotiator = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") ?? "",
    },
  });

  try {
    return (
      getLocaleFromValue({
        locale: match(negotiator.languages(), LOCALES, DEFAULT_LOCALE),
      }) ?? DEFAULT_LOCALE
    );
  } catch {
    return DEFAULT_LOCALE;
  }
}
