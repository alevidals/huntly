import { desc, relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const usersSchema = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessionsSchema = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accountsSchema = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verificationsSchema = sqliteTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const applicationsSchema = sqliteTable(
  "applications",
  {
    id: text("id")
      .primaryKey()
      .$default(() => crypto.randomUUID()),
    companyName: text("company_name").notNull(),
    position: text("position").notNull(),
    status: text("status", {
      enum: ["inProgress", "rejected", "accepted"],
    })
      .notNull()
      .default("inProgress"),
    recruiterName: text("recruiter_name"),
    recruiterEmail: text("recruiter_email"),
    recruiterPhone: text("recruiter_phone"),
    appliedAt: text("applied_at").notNull(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => usersSchema.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("applications_userId_appliedAt_idx").on(
      table.userId,
      desc(table.appliedAt),
    ),
    index("applications_userId_status_idx").on(table.userId, table.status),
    check(
      "applications_status_check",
      sql`${table.status} IN ('pending', 'in_progress', 'rejected', 'accepted')`,
    ),
  ],
);

export const usersRelations = relations(usersSchema, ({ many }) => ({
  sessions: many(sessionsSchema),
  accounts: many(accountsSchema),
  applications: many(applicationsSchema),
}));

export const sessionsRelations = relations(sessionsSchema, ({ one }) => ({
  users: one(usersSchema, {
    fields: [sessionsSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const accountsRelations = relations(accountsSchema, ({ one }) => ({
  users: one(usersSchema, {
    fields: [accountsSchema.userId],
    references: [usersSchema.id],
  }),
}));

export const applicationsRelations = relations(
  applicationsSchema,
  ({ one }) => ({
    users: one(usersSchema, {
      fields: [applicationsSchema.userId],
      references: [usersSchema.id],
    }),
  }),
);

export type Application = typeof applicationsSchema.$inferSelect;
export type InsertApplication = Omit<
  typeof applicationsSchema.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>;
