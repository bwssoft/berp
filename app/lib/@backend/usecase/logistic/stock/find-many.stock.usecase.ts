import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IStock } from "@/backend/domain/logistic/entity/stock.entity";
import type { IStockRepository } from "@/backend/domain/logistic/repository/stock.repository";
import { stockRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IStock>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IStock>;
}

class FindManyStockUsecase {
  repository: IStockRepository = stockRepository;

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
    );
  }
}

export const findManyStockUsecase = singleton(FindManyStockUsecase);
