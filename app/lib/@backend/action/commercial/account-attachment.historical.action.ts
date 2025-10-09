"use server";

import { createAccountAttachmentUsecase } from "@/backend/usecase/commercial/account-attachment/create-account-attachment.usecase";
import { IUser } from "@/backend/domain/admin/entity/user.definition";
import { IAccountAttachment } from "@/backend/domain/commercial/entity/account-attachment.definition";
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
      fileName: fileData.name,
      user: currentUser,
    });

    const name = fileData.name;

    // Revalidate the account attachments page to show the new attachment
    revalidatePath("/commercial/account/management/account-attachments");

    return { success: true, fileUrl, name, id };
  } catch (error) {
    console.error("Error in createAccountAttachment action:", error);
    return { success: false, error: "Failed to upload attachment" };
  }
}

