"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/shared/lib/auth/server";

type SignInParams = {
  redirectTo?: string;
};

export async function signIn({ redirectTo }: SignInParams = {}) {
  try {
    const { url } = await auth.api.signInSocial({
      body: {
        provider: "github",
        callbackURL: redirectTo,
      },
    });

    if (!url) {
      throw new Error("Failed to get sign-in URL");
    }

    redirect(url);
  } catch (error) {
    unstable_rethrow(error);

    console.error("Error during sign-in:", error);
    redirect("/");
  }
}
