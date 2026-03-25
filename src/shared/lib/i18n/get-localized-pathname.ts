import type { Locale } from "@/shared/lib/i18n/types";

type GetLocalizedPathnameParams = {
  locale: Locale;
  pathname: string;
};

export function getLocalizedPathname({
  locale,
  pathname,
}: GetLocalizedPathnameParams): string {
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  if (normalizedPathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPathname}`;
}
