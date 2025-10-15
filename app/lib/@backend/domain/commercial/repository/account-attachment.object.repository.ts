import type { IBaseObjectRepository } from "@/backend/domain/@shared/repository/object.repository.interface";

export interface IAccountAttachmentObjectRepository
  extends IBaseObjectRepository<Buffer> {}
