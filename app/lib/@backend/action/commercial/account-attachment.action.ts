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

export async function createAccountAttachment(
  fileData: FileData,
  metadata: Omit<IAccountAttachment, "file" | "createdAt" | "user">
) {
  try {
    // Get current user information
    const currentUser = await getCurrentUser();

    if (!currentUser) return { success: false };

    // Generate a unique ID if one wasn't provided
    const id = metadata.id || crypto.randomUUID();

    // Convert array back to Buffer
    const buffer = Buffer.from(fileData.buffer);

    const fileUrl = await createAccountAttachmentUsecase.execute({
      file: buffer,
      metadata: {
        ...metadata,
        id,
      },
      user: currentUser,
      fileName: fileData.name,
    });

    // Revalidate the account attachments page to show the new attachment
    revalidatePath("/commercial/account/management/account-attachments");

    return { success: true, fileUrl };
  } catch (error) {
    console.error("Error in createAccountAttachment action:", error);
    return { success: false, error: "Failed to upload attachment" };
  }
}
