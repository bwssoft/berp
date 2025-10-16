import type { Filter } from "mongodb";

import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import { priceTableRepository } from "@/backend/infra";

class FindOnePriceTableUsecase {
  repository: IPriceTableRepository;

  constructor() {
    this.repository = priceTableRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IPriceTable>) {
    const result = await this.repository.findOne(input);

    return result;
  }
}

export const findOnePriceTableUsecase = singleton(FindOnePriceTableUsecase);

