import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { componentCategoryRepository } from "@/app/lib/@backend/infra";
import {
  IComponentCategory,
  IComponentCategoryRepository,
} from "@/app/lib/@backend/domain";
import { RemoveFields } from "@/app/lib/@backend/decorators";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

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
