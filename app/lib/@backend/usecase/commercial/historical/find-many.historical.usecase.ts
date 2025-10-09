import { IHistorical } from "@/backend/domain/commercial/entity/historical.definition";
import { IHistoricalRepository } from "@/backend/domain/commercial/repository/historical.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { historicalRepository } from "@/backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IHistorical>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IHistorical>;
}

class FindManyHistoricalUsecase {
  repository: IHistoricalRepository;

  constructor() {
    this.repository = historicalRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort ?? { name: 1 }
    );
  }
}

export const findManyHistoricalUsecase = singleton(FindManyHistoricalUsecase);

