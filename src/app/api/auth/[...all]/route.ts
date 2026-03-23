import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/shared/lib/auth/server";

export const { GET, POST } = toNextJsHandler(auth);
