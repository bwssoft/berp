import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAccountAttachment } from "@/backend/domain/commercial/entity/account-attachment.definition";

export interface IAccountAttachmentRepository
  extends IBaseRepository<IAccountAttachment> {}
