import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";

import { accountEconomicGroupRepository } from "@/backend/infra";

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

