import {
  IAccountAttachment,
  IAccountAttachmentRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { accountAttachmentRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

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
    return await this.repository.findMany(
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
