import { IPriceTableService } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class PriceTableServiceRepository extends BaseRepository<IPriceTableService> {
  constructor() {
    super({
      collection: "commercial.price-table-service",
      db: "berp",
    });
  }
}

export const priceTableServiceRepository = singleton(PriceTableServiceRepository);
