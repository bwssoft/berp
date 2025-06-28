import { AuditDomain, IAccountAttachment } from "@/app/lib/@backend/domain";
import {
  IAccountAttachmentRepository,
  IAccountAttachmentObjectRepository,
} from "@/app/lib/@backend/domain/commercial/repository";
import { getContentTypeFromFileName } from "@/app/lib/util/get-content-type-from-filename";
import { singleton } from "@/app/lib/util/singleton";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

interface CreateAccountAttachmentHistoricalUseCaseProps {
  accountAttachmentObjectRepository: IAccountAttachmentObjectRepository;
}
import { accountAttachmentRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account-attachment.repository";

export class CreateAccountAttachmentHistoricalUseCase {
  private accountAttachmentObjectRepository: IAccountAttachmentObjectRepository;
  private accountAttachmentHistoricalRepository: IAccountAttachmentRepository;

  constructor(props: CreateAccountAttachmentHistoricalUseCaseProps) {
    this.accountAttachmentObjectRepository =
      props.accountAttachmentObjectRepository;
    this.accountAttachmentHistoricalRepository = accountAttachmentRepository;
  }

  async execute(params: {
    file: Buffer;
    metadata: Omit<IAccountAttachment, "file" | "createdAt">;
    fileName: string;
  }): Promise<string> {
    try {
      const { file: buffer, metadata, fileName } = params;

      // Extract file extension from original filename
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
      const originalNameWithoutExt = fileName.includes(".")
        ? fileName.slice(0, fileName.lastIndexOf("."))
        : fileName;

      // Ensure metadata name includes the file extension
      const nameWithExtension = metadata.name
        .toLowerCase()
        .endsWith(`.${fileExtension}`)
        ? metadata.name
        : `${metadata.name}.${fileExtension}`;

      // Update metadata to include proper filename with extension
      metadata.name = nameWithExtension;

      // Generate a unique key for S3, preserving the file extension
      const uniqueKey = `${metadata.id}-${nameWithExtension.replace(/\s+/g, "_")}`;

      const contentType = getContentTypeFromFileName(fileName);

      // Upload file to S3 with content type
      await this.accountAttachmentObjectRepository.create({
        data: buffer,
        key: uniqueKey,
        contentType,
      });

      // Save metadata to MongoDB with name including extension
      if (!metadata.id || !metadata.name) {
        throw new Error("Missing required fields for attachment metadata");
      }

      // Create the attachment object to save
      const attachment: IAccountAttachment = {
        id: metadata.id,
        name: metadata.name, // Name now includes proper file extension
        userId: metadata.userId || "System",
        createdAt: new Date(),
        accountId: metadata.accountId,
      };

      // Save to MongoDB
      await this.accountAttachmentHistoricalRepository.create(attachment);

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: attachment,
          before: {},
          domain: AuditDomain.accountAttachments,
          user: { email, name, id: user_id },
          action: `Anexo '${attachment.name}' cadastrado${
            attachment.accountId ? ` para a conta ${attachment.accountId}` : ""
          }`,
        });
      }

      // Generate and return the URL to access the file
      const fileUrl =
        this.accountAttachmentObjectRepository.generateUrl(uniqueKey);
      return fileUrl;
    } catch (error) {
      console.error("Error creating account attachment:", error);
      throw new Error("Failed to create account attachment");
    }
  }
}

class CreateAccountAttachmentUseCaseImpl extends CreateAccountAttachmentHistoricalUseCase {
  constructor() {
    const {
      accountAttachmentObjectRepository,
    } = require("@/app/lib/@backend/infra/repository/s3/commercial");
    super({ accountAttachmentObjectRepository });
  }
}

export const createAccountAttachmentHistoricalUsecase = singleton(
  CreateAccountAttachmentUseCaseImpl
);
