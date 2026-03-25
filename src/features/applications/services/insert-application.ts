"use server";

import { db } from "@/shared/lib/db";
import {
  applicationsSchema,
  type InsertApplication,
} from "@/shared/lib/db/schema";

type InsertApplicationParams = {
  application: InsertApplication;
};

export async function insertApplication({
  application,
}: InsertApplicationParams) {
  try {
    const insertedApplication = await db
      .insert(applicationsSchema)
      .values(application)
      .returning()
      .get();

    return insertedApplication;
  } catch (error) {
    console.error("Error inserting application:", error);

    throw new Error("Failed to insert application");
  }
}
