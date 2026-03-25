import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/services/get-session";
import { getLocalizedPathname } from "@/shared/lib/i18n/get-localized-pathname";
import type { Locale } from "@/shared/lib/i18n/types";

type RequireAuthParams = {
  locale: Locale;
};

export async function requireAuth({ locale }: RequireAuthParams) {
  const session = await getSession();

  if (!session) {
    const pathname = getLocalizedPathname({
      locale,
      pathname: "/",
    });
    redirect(pathname);
  }

  return session;
}
