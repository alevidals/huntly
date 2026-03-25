import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/features/auth/services/get-session";
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

const PROTECTED_ROUTES = ["/dashboard"] as const;

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (protectedRoute) =>
      pathname === protectedRoute || pathname.startsWith(`${protectedRoute}/`),
  );
}

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
  const cookieLocale = getLocaleFromValue({
    locale: request.cookies.get(PREFERRED_LOCALE_COOKIE)?.value,
  });
  const fallbackLocale = cookieLocale ?? getLocaleFromBrowser({ request });
  const protectedPathname = pathnameLocale
    ? getRedirectPathname({ pathname, firstSegment })
    : pathname;
  const locale = pathnameLocale ?? fallbackLocale;

  if (isProtectedRoute(protectedPathname)) {
    const session = await getSession({
      headers: request.headers,
    });

    if (!session) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = getLocalizedPathname({
        locale,
        pathname: "/",
      });

      const response = NextResponse.redirect(redirectUrl);
      setPreferredLocaleCookie({ response, locale });

      return response;
    }
  }

  if (pathnameLocale) {
    if (cookieLocale === pathnameLocale) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    setPreferredLocaleCookie({ response, locale: pathnameLocale });

    return response;
  }

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
