import "server-only";

import { headers } from "next/headers";
import { auth } from "@/shared/lib/auth/server";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
