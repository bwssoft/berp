import { singleton } from "@/app/lib/util/singleton";
import { ITemporalProductStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductTemporalStockRepository extends BaseRepository<ITemporalProductStock> {
  constructor() {
    super({
      collection: "product-temporal-stock",
      db: "bstock"
    });
  }
}

export const productTemporalStockRepository = singleton(ProductTemporalStockRepository)
