import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import {
  IAccountEconomicGroup,
  IAccountEconomicGroupRepository,
} from "@/app/lib/@backend/domain";
import { accountEconomicGroupRepository } from "@/app/lib/@backend/infra";

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
