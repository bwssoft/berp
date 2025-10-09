
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { accountEconomicGroupRepository } from "@/backend/infra";
import type { Filter } from "mongodb";
import type { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IAccountEconomicGroupRepository } from "@/backend/domain/commercial";
import type { IAccountEconomicGroup } from "@/backend/domain/commercial/entity/account.economic-group.definition";

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
    return this.repository.findMany(
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

