import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { productCategoryRepository } from "@/app/lib/@backend/infra";
import {
  IProductCategory,
  IProductCategoryRepository,
} from "@/app/lib/@backend/domain";
import { RemoveFields } from "@/app/lib/@backend/decorators";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IProductCategory>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IProductCategory>;
}
class FindManyProductCategoryUsecase {
  repository: IProductCategoryRepository;

  constructor() {
    this.repository = productCategoryRepository;
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

export const findManyProductCategoryUsecase = singleton(
  FindManyProductCategoryUsecase
);
