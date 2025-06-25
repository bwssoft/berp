import { IAccountAttachment } from "@/app/lib/@backend/domain/commercial/entity/account-attachment.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class AccountAttachmentHistoricalRepository extends BaseRepository<IAccountAttachment> {
  constructor() {
    super({
      collection: "commercial-account-attachments-historical",
      db: "berp",
    });
  }
}

export const accountAttachmentHistoricalRepository = singleton(
  AccountAttachmentHistoricalRepository
);
