import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/backend/domain/commercial/entity/product.definition";
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

