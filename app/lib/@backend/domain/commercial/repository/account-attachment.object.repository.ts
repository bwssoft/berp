import { IBaseObjectRepository } from "../../@shared/repository/object.repository.interface";

export interface IAccountAttachmentObjectRepository
  extends IBaseObjectRepository<Buffer> {}
