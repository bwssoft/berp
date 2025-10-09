import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import { IPriceTableRepository } from "@/backend/domain/commercial/repository/price-table.repository";
import { priceTableRepository } from "@/backend/infra/mongodb/commercial/price-table.repository";

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

