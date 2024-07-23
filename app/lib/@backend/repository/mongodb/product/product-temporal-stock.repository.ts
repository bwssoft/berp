import { singleton } from "@/app/lib/util/singleton";
import { IProductTemporalStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductTemporalStockRepository extends BaseRepository<IProductTemporalStock> {
  constructor() {
    super({
      collection: "product-temporal-stock",
      db: "berp"
    });
  }
}

export const productTemporalStockRepository = singleton(ProductTemporalStockRepository)
