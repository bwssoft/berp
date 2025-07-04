"use server";

import {
  accountAttachmentHistoricalObjectRepository,
  accountAttachmentObjectRepository,
  accountAttachmentRepository,
} from "../../infra";

export async function downloadAccountAttachmentHistorical(id: string) {
  try {
    // First get the metadata from MongoDB
    const attachment = await accountAttachmentRepository.findOne({ id });
    if (!attachment) {
      return {
        success: false,
        error: "Attachment metadata not found",
      };
    }

    // Need to include the original filename in the key
    const originalFileName = attachment.name;
    const key = `${id}-${originalFileName.replace(/\s+/g, "_")}`;

    // Download the file from S3
    const result = await accountAttachmentObjectRepository.findOne(key);

    if (!result) {
      return {
        success: false,
        error: "File not found in storage",
      };
    }

    // Convert Buffer to regular array for serialization
    const arrayData = Array.from(new Uint8Array(result.data));
    return {
      success: true,
      data: arrayData,
      contentType: result.contentType,
    };
  } catch (error) {
    console.error("Error downloading account attachment:", error);
    return { success: false, error: "Failed to download attachment" };
  }
}
