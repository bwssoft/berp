"use server";

import { accountAttachmentObjectRepository } from "@/app/lib/@backend/infra/repository/s3/commercial";
import { accountAttachmentRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account-attachment.repository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/app/lib/@backend/usecase/admin/audit";
import { AuditDomain } from "@/app/lib/@backend/domain";

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

    // Create a copy of the attachment for audit before deletion
    const attachmentCopy = { ...attachment };

    // Delete metadata from MongoDB
    await accountAttachmentRepository.deleteOne({ id });

    // Add audit log
    const session = await auth();
    if (session?.user) {
      const { name, email, id: user_id } = session.user;
      await createOneAuditUsecase.execute({
        before: attachmentCopy,
        after: {},
        domain: AuditDomain.accountAttachments,
        user: { email, name, id: user_id },
        action: `Anexo '${attachmentCopy.name}' excluído${attachmentCopy.accountId ? ` da conta ${attachmentCopy.accountId}` : ""}`,
      });
    }

    revalidatePath(
      `/commercial/account/management/account-attachments?id=${id}`
    );
    return { success: true, deletedId: id };
  } catch (error) {
    console.error("Error deleting account attachment:", error);
    return { success: false, error: "Failed to delete attachment" };
  }
}
