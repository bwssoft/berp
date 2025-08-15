import { IAccountEconomicGroup } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class AccountEconomicGroupRepository extends BaseRepository<IAccountEconomicGroup> {
  constructor() {
    super({
      collection: "commercial.account-economic-group",
      db: "berp",
    });
  }
}

export const accountEconomicGroupRepository = singleton(
  AccountEconomicGroupRepository
);
