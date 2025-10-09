import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { productRepository } from "@/app/lib/@backend/infra";
import { IProduct } from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import { IProductRepository } from "@/app/lib/@backend/domain/commercial/repository/product.repository";
import { RemoveFields } from "@/app/lib/@backend/decorators";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IProduct>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IProduct>;
}
class FindManyProductUsecase {
  repository: IProductRepository;

  constructor() {
    this.repository = productRepository;
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

export const findManyProductUsecase = singleton(FindManyProductUsecase);
