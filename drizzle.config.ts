import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) {
  throw new Error(
    "DATABASE_URL and DATABASE_AUTH_TOKEN must be set in environment variables",
  );
}

export default defineConfig({
  out: "./src/shared/lib/db/migrations",
  schema: "./src/shared/lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
