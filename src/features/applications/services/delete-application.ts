import { eq } from "drizzle-orm";
import { db } from "@/shared/lib/db";
import { applicationsSchema } from "@/shared/lib/db/schema";

type DeleteApplicationParams = {
  applicationId: string;
};

export async function deleteApplication({
  applicationId,
}: DeleteApplicationParams) {
  try {
    await db
      .delete(applicationsSchema)
      .where(eq(applicationsSchema.id, applicationId));
  } catch (error) {
    console.error("Error deleting application:", error);

    throw new Error("Failed to delete application");
  }
}
