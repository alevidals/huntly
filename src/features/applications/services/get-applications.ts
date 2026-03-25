"use server";

import { db } from "@/shared/lib/db";

type GetApplicationsParams = {
  userId: string;
};

export async function getApplications({ userId }: GetApplicationsParams) {
  try {
    const applications = await db.query.applicationsSchema.findMany({
      where: (applications, { eq }) => eq(applications.userId, userId),
    });

    return applications ?? [];
  } catch (error) {
    console.error("Error fetching applications:", error);

    throw new Error("Failed to fetch applications");
  }
}
