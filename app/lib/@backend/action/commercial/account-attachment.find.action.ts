"use server";

import { accountRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account.repository";

import { accountAttachmentRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account-attachment.repository";

export async function findManyAccountAttachments(accountId?: string) {
  try {
    // Get account details if accountId is provided to verify permissions
    if (accountId) {
      const account = await accountRepository.findOne({ id: accountId });
      if (!account) {
        throw new Error("Account not found");
      }
    }

    const filter = accountId ? { accountId } : {};
    console.log("Finding attachments with filter:", filter);
    const result = await accountAttachmentRepository.findMany(filter);
    console.log("Query result:", result);

    if (!result || !result.docs || result.docs.length === 0) {
      console.log("No attachments found in database");
      return [];
    }

    const attachments = result.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      userId: doc.userId,
      createdAt: doc.createdAt,
      accountId: doc.accountId,
    }));
    console.log("Returning attachments:", attachments);
    return attachments;
  } catch (error) {
    console.error("Error finding account attachments:", error);
    console.error(error);
    return [];
  }
}
