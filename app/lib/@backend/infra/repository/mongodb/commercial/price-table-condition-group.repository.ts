import { IPriceTableConditionGroup } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class PriceTableConditionGroupRepository extends BaseRepository<IPriceTableConditionGroup> {
  constructor() {
    super({
      collection: "commercial.price-table-condition-group",
      db: "berp",
    });
  }
}

export const priceTableConditionGroupRepository = singleton(PriceTableConditionGroupRepository);
