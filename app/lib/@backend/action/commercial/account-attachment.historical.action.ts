"use server";

import { createAccountAttachmentUsecase } from "@/app/lib/@backend/usecase/commercial/account-attachment/create-account-attachment.usecase";
import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/lib/util/get-current-user";

interface FileData {
  buffer: number[];
  name: string;
  type: string;
  size: number;
}

export async function createAccountAttachmentHistorical(
  fileData: FileData,
  metadata: Omit<IAccountAttachment, "file" | "createdAt" | "userId">
) {
  try {
    // Get current user information
    const currentUser = await getCurrentUser();

    // Generate a unique ID if one wasn't provided
    const id = metadata.id || crypto.randomUUID();

    // Use the current user's name or email as the userId if available
    const userId = currentUser.name || currentUser.email || "System User";

    // Convert array back to Buffer
    const buffer = Buffer.from(fileData.buffer);

    const fileUrl = await createAccountAttachmentUsecase.execute({
      file: buffer,
      metadata: {
        ...metadata,
        id,
        userId,
      },
      fileName: fileData.name,
    });

    const name = fileData.name

    // Revalidate the account attachments page to show the new attachment
    revalidatePath("/commercial/account/management/account-attachments");

    return { success: true, fileUrl, name };
  } catch (error) {
    console.error("Error in createAccountAttachment action:", error);
    return { success: false, error: "Failed to upload attachment" };
  }
}
