"use server";

import { createInsertSchema } from "drizzle-zod";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { insertApplication } from "@/features/applications/services/insert-application";
import { getSession } from "@/features/auth/services/get-session";
import { applicationsSchema } from "@/shared/lib/db/schema";
import type { ServerActionResponse } from "@/shared/types";

const insertApplicationSchema = createInsertSchema(applicationsSchema, {
  userId: z.string().optional(),
});

type InsertApplicationData = z.infer<typeof insertApplicationSchema>;

export async function insertApplicationAction(
  _state: unknown,
  formData: FormData,
): Promise<ServerActionResponse<InsertApplicationData>> {
  const session = await getSession();

  if (!session) {
    // TODO: redirect to localized route
    redirect("/");
  }

  const data = Object.fromEntries(
    formData.entries(),
  ) as unknown as InsertApplicationData;

  console.log("Received form data", data);

  const result = insertApplicationSchema.safeParse(data);

  console.log("Validation result", result);

  if (!result.success) {
    const flattened = z.flattenError(result.error);

    return {
      success: false,
      error: "Invalid form data",
      data,
      errors: {
        companyName: flattened.fieldErrors.companyName?.[0],
        position: flattened.fieldErrors.position?.[0],
        status: flattened.fieldErrors.status?.[0],
        appliedAt: flattened.fieldErrors.appliedAt?.[0],
        description: flattened.fieldErrors.description?.[0],
        recruiterEmail: flattened.fieldErrors.recruiterEmail?.[0],
        recruiterName: flattened.fieldErrors.recruiterName?.[0],
        recruiterPhone: flattened.fieldErrors.recruiterPhone?.[0],
      },
    };
  }

  try {
    await insertApplication({
      application: {
        ...result.data,
        userId: session.user.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    unstable_rethrow(error);

    console.error("Failed to insert application", error);

    return {
      success: false,
      error: "Failed to insert application",
      data,
    };
  }

  // TODO: redirect to localized route
  redirect("/dashboard");
}
