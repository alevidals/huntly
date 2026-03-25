"use server";

import { cookies, headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/shared/lib/auth/server";
import { DEFAULT_LOCALE } from "@/shared/lib/i18n/constants";
import { getLocalizedPathname } from "@/shared/lib/i18n/get-localized-pathname";

type SignOutParams = {
  redirectTo?: string;
};

export async function signOut({ redirectTo }: SignOutParams = {}) {
  const fallbackRedirectTo = getLocalizedPathname({
    locale: DEFAULT_LOCALE,
    pathname: "/",
  });

  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    unstable_rethrow(error);

    console.error("Error during sign-out:", error);
    const cookieStore = await cookies();
    cookieStore.delete("huntly_session_token");
  } finally {
    redirect(redirectTo ?? fallbackRedirectTo);
  }
}
