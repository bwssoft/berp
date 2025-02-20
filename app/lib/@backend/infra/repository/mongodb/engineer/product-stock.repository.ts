import { singleton } from "@/app/lib/util/singleton";
import { IProductStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class ProductStockRepository extends BaseRepository<IProductStock> {
  constructor() {
    super({
      collection: "product-stock",
      db: "berp"
    });
  }
}

export const productStockRepository = singleton(ProductStockRepository);
