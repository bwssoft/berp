"use server";

import { accountAttachmentObjectRepository } from "@/app/lib/@backend/infra/repository/s3/commercial";
import { accountAttachmentRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account-attachment.repository";
import { revalidatePath } from "next/cache";

export async function deleteAccountAttachment(id: string) {
  try {
    // First get the metadata from MongoDB to get the file name
    const attachment = await accountAttachmentRepository.findOne({ id });
    if (!attachment) {
      return {
        success: false,
        error: "Attachment metadata not found",
      };
    }

    // Generate the S3 key using the name
    const key = `${id}-${attachment.name.replace(/\s+/g, "_")}`;

    // Delete from S3
    await accountAttachmentObjectRepository.deleteOne(key);

    // Delete metadata from MongoDB
    await accountAttachmentRepository.deleteOne({ id });

    // Return deleted ID to help the UI update
    return { success: true, deletedId: id };
  } catch (error) {
    console.error("Error deleting account attachment:", error);
    return { success: false, error: "Failed to delete attachment" };
  }
}
