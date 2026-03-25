import "server-only";

import { headers } from "next/headers";
import { auth } from "@/shared/lib/auth/server";

type GetSessionParams = {
  headers?: Headers;
};

export async function getSession(params?: GetSessionParams) {
  const session = await auth.api.getSession({
    headers: params?.headers ?? (await headers()),
  });

  return session;
}
