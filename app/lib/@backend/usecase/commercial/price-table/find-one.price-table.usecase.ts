import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IPriceTable, IPriceTableRepository } from "@/app/lib/@backend/domain";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";

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
