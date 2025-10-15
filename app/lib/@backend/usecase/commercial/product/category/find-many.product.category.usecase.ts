import type { Filter } from "mongodb";

import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IProductCategoryRepository } from "@/backend/domain/commercial";
import type { IProductCategory } from "@/backend/domain/commercial/entity/product.category.definition";
import { productCategoryRepository } from "@/backend/infra";

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

