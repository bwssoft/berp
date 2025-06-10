import { IAccountAttachment } from "@/app/lib/@backend/domain";
import { IAccountAttachmentObjectRepository } from "@/app/lib/@backend/domain/commercial/repository";
import { getContentTypeFromFileName } from "@/app/lib/util/get-content-type-from-filename";
import { singleton } from "@/app/lib/util/singleton";

interface CreateAccountAttachmentUseCaseProps {
  accountAttachmentObjectRepository: IAccountAttachmentObjectRepository;
}

import { IAccountAttachmentRepository } from "@/app/lib/@backend/domain/commercial/repository/account-attachment.repository";
import { accountAttachmentRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/account-attachment.repository";

export class CreateAccountAttachmentUseCase {
  private accountAttachmentObjectRepository: IAccountAttachmentObjectRepository;
  private accountAttachmentRepository: IAccountAttachmentRepository;

  constructor(props: CreateAccountAttachmentUseCaseProps) {
    this.accountAttachmentObjectRepository =
      props.accountAttachmentObjectRepository;
    this.accountAttachmentRepository = accountAttachmentRepository;
  }

  async execute(params: {
    file: Buffer;
    metadata: Omit<IAccountAttachment, "file" | "createdAt">;
    fileName: string;
  }): Promise<string> {
    try {
      const { file: buffer, metadata, fileName } = params;

      // Generate a unique key for the file using the user's chosen name
      const timestamp = Date.now();
      const fileExtension = fileName.split(".").pop() || "";
      const uniqueKey = `${metadata.id || timestamp}-${metadata.name.replace(/\s+/g, "_")}`;

      // Upload file to S3
      await this.accountAttachmentObjectRepository.create({
        data: buffer,
        key: uniqueKey,
      });

      // Save metadata to MongoDB
      if (!metadata.id || !metadata.name) {
        throw new Error("Missing required fields for attachment metadata");
      }

      // Store the user's chosen name from the form
      await this.accountAttachmentRepository.create({
        id: metadata.id,
        name: metadata.name, // Use the name from the form input
        userId: metadata.userId || "System",
        createdAt: new Date(),
      });

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

class CreateAccountAttachmentUseCaseImpl extends CreateAccountAttachmentUseCase {
  constructor() {
    const {
      accountAttachmentObjectRepository,
    } = require("@/app/lib/@backend/infra/repository/s3/commercial");
    super({ accountAttachmentObjectRepository });
  }
}

export const createAccountAttachmentUsecase = singleton(
  CreateAccountAttachmentUseCaseImpl
);
