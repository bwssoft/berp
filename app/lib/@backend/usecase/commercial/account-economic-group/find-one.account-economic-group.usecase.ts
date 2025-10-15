import type { Filter } from "mongodb";

import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { accountEconomicGroupRepository } from "@/backend/infra";
import type { IAccountEconomicGroup } from "@/backend/domain/commercial/entity/account.economic-group.definition";
import type { IAccountEconomicGroupRepository } from "@/backend/domain/commercial";

class FindOneAccountEconomicGroupUsecase {
  repository: IAccountEconomicGroupRepository;

  constructor() {
    this.repository = accountEconomicGroupRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IAccountEconomicGroup>) {
    return await this.repository.findOne(input);
  }
}

export const findOneAccountEconomicGroupUsecase = singleton(
  FindOneAccountEconomicGroupUsecase
);

