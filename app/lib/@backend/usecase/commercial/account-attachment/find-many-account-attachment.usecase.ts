
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { accountAttachmentRepository } from "@/backend/infra";
import type { Filter } from "mongodb";
import type { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IAccountAttachment } from "@/backend/domain/commercial/entity/account-attachment.definition";
import type { IAccountAttachmentRepository } from "@/backend/domain/commercial/repository";

namespace Dto {
  export interface Input {
    filter?: Filter<IAccountAttachment>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IAccountAttachment>;
}

class FindManyAccountAttachmentUsecase {
  repository: IAccountAttachmentRepository;

  constructor() {
    this.repository = accountAttachmentRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort ?? { createdAt: -1 }
    );
  }
}

export const findManyAccountAttachmentUsecase = singleton(
  FindManyAccountAttachmentUsecase
);

