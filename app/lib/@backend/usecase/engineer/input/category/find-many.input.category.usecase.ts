import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { inputCategoryRepository } from "@/backend/infra";

import { RemoveFields } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IInputCategory>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IInputCategory>;
}
class FindManyInputCategoryUsecase {
  repository: IInputCategoryRepository;

  constructor() {
    this.repository = inputCategoryRepository;
  }

  @RemoveFields("_id")
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
    );
  }
}

export const findManyInputCategoryUsecase = singleton(
  FindManyInputCategoryUsecase
);

