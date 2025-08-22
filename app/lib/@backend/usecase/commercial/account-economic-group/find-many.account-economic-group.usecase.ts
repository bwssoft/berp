import {
  IAccountEconomicGroup,
  IAccountEconomicGroupRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { accountEconomicGroupRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IAccountEconomicGroup>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IAccountEconomicGroup>;
}

class FindManyAccountEconomicGroupUsecase {
  repository: IAccountEconomicGroupRepository;

  constructor() {
    this.repository = accountEconomicGroupRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort ?? { id: 1 }
    );
  }
}

export const findManyAccountEconomicGroupUsecase = singleton(
  FindManyAccountEconomicGroupUsecase
);
