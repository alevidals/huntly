import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/shared/lib/db/index";
import * as schema from "@/shared/lib/db/schema";
import { env } from "@/shared/lib/env/index";

export const auth = betterAuth({
  appName: "Huntly",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      ...schema,
      users: schema.usersSchema,
      accounts: schema.accountsSchema,
      sessions: schema.sessionsSchema,
      verifications: schema.verificationsSchema,
    },
    usePlural: true,
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: "huntly_session_token",
      },
    },
  },
  plugins: [nextCookies()],
});
