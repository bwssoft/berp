
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IBase } from "@/backend/domain/logistic/entity/base.entity";
import type { ILogisticBaseRepository } from "@/backend/domain/logistic/repository/base.repository";
import { baseRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IBase>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IBase>;
}

class FindManyBaseUsecase {
  repository: ILogisticBaseRepository = baseRepository;

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

export const findManyBaseUsecase = singleton(FindManyBaseUsecase);
