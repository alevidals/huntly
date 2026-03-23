"use server";

import { cookies, headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { auth } from "@/shared/lib/auth/server";

export async function signOut() {
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
    redirect("/");
  }
}
