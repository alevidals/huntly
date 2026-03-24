import { db } from "@/shared/lib/db";

type IsApplicationOwnedByUserParams = {
  applicationId: string;
  userId: string;
};

export async function isApplicationOwnedByUser({
  applicationId,
  userId,
}: IsApplicationOwnedByUserParams) {
  try {
    const application = await db.query.applicationsSchema.findFirst({
      where: (applicationsSchema, { eq }) =>
        eq(applicationsSchema.id, applicationId) &&
        eq(applicationsSchema.userId, userId),
    });

    return !!application;
  } catch (error) {
    console.error("Error checking application ownership:", error);

    throw new Error("Failed to check application ownership");
  }
}
