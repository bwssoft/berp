import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IComponentCategory } from "@/backend/domain/engineer/entity/component.category.definition";
import type { IComponentCategoryRepository } from "@/backend/domain/engineer/repository/component.category.repository";
import { componentCategoryRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IComponentCategory>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IComponentCategory>;
}
class FindManyComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
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

export const findManyComponentCategoryUsecase = singleton(
  FindManyComponentCategoryUsecase
);

