import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super({
      collection: "commercial.product",
      db: "berp",
    });
  }
}

export const productRepository = singleton(ProductRepository);
