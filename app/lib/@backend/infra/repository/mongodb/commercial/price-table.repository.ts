import { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class PriceTableRepository extends BaseRepository<IPriceTable> {
  constructor() {
    super({
      collection: "commercial.price-table",
      db: "berp",
    });
  }
}

export const priceTableRepository = singleton(PriceTableRepository);

