import { IPriceTableProduct } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class PriceTableProductRepository extends BaseRepository<IPriceTableProduct> {
  constructor() {
    super({
      collection: "commercial.price-table-product",
      db: "berp",
    });
  }
}

export const priceTableProductRepository = singleton(PriceTableProductRepository);
