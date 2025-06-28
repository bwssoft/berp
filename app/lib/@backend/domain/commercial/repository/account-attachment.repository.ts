import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IAccountAttachment } from "../entity/account-attachment.definition";

export interface IAccountAttachmentRepository
  extends IBaseRepository<IAccountAttachment> {}
