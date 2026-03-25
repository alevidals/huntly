"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/shared/lib/auth/server";
import { DEFAULT_LOCALE } from "@/shared/lib/i18n/constants";
import { getLocalizedPathname } from "@/shared/lib/i18n/get-localized-pathname";

type SignInParams = {
  redirectTo?: string;
};

export async function signIn({ redirectTo }: SignInParams = {}) {
  const fallbackRedirectTo = getLocalizedPathname({
    locale: DEFAULT_LOCALE,
    pathname: "/",
  });

  try {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "github",
        callbackURL: redirectTo ?? fallbackRedirectTo,
      },
    });

    if (!url) {
      throw new Error("Failed to get sign-in URL");
    }

    redirect(url);
  } catch (error) {
    unstable_rethrow(error);

    console.error("Error during sign-in:", error);
    redirect(redirectTo ?? fallbackRedirectTo);
  }
}
