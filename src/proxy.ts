import { type NextRequest, NextResponse } from "next/server";
import { PREFERRED_LOCALE_COOKIE } from "@/shared/lib/i18n/constants";
import { getLocaleFromBrowser } from "@/shared/lib/i18n/get-locale-from-browser";
import { getLocaleFromValue } from "@/shared/lib/i18n/get-locale-from-value";
import { getLocalizedPathname } from "@/shared/lib/i18n/get-localized-pathname";
import { looksLikeLocale } from "@/shared/lib/i18n/looks-like-locale";

type GetRedirectPathnameParams = {
  pathname: string;
  firstSegment: string;
};

type SetPreferredLocaleCookieParams = {
  response: NextResponse;
  locale: string;
};

function getRedirectPathname({
  pathname,
  firstSegment,
}: GetRedirectPathnameParams): string {
  if (!firstSegment) {
    return pathname;
  }

  if (!looksLikeLocale({ segment: firstSegment })) {
    return pathname;
  }

  const remainingSegments = pathname.split("/").slice(2).join("/");

  return remainingSegments ? `/${remainingSegments}` : "/";
}

function setPreferredLocaleCookie({
  response,
  locale,
}: SetPreferredLocaleCookieParams) {
  response.cookies.set(PREFERRED_LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1] ?? "";
  const pathnameLocale = getLocaleFromValue({ locale: firstSegment });

  if (pathnameLocale) {
    const cookieLocale = getLocaleFromValue({
      locale: request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value,
    });

    if (cookieLocale === pathnameLocale) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    setPreferredLocaleCookie({ response, locale: pathnameLocale });

    return response;
  }

  const fallbackLocale =
    getLocaleFromValue({
      locale: request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value,
    }) ?? getLocaleFromBrowser({ request });
  const redirectPathname = getRedirectPathname({ pathname, firstSegment });
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = getLocalizedPathname({
    locale: fallbackLocale,
    pathname: redirectPathname,
  });

  const response = NextResponse.redirect(redirectUrl);
  setPreferredLocaleCookie({ response, locale: fallbackLocale });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
  ],
};
