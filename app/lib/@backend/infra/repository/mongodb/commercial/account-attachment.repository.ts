import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class AccountAttachmentRepository extends BaseRepository<IAccountAttachment> {
  constructor() {
    super({
      collection: "commercial.account-attachments",
      db: "berp",
    });
  }
}

export const accountAttachmentRepository = singleton(
  AccountAttachmentRepository
);
