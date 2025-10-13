
import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IInputCategory } from "@/backend/domain/engineer/entity/input.category.definition";
import type { IInputCategoryRepository } from "@/backend/domain/engineer/repository/input.category.repository";
import { inputCategoryRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

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
