import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IStock } from "@/backend/domain/logistic/entity/stock.entity";
import type { IStockRepository } from "@/backend/domain/logistic/repository/stock.repository";
import { stockRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IStock>;
  }
  export type Output = IStock | null;
}

class FindOneStockUsecase {
  repository: IStockRepository = stockRepository;

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg.filter ?? {});
  }
}

export const findOneStockUsecase = singleton(FindOneStockUsecase);
