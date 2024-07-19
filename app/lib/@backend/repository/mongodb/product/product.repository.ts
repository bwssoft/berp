import { singleton } from "@/app/lib/util/singleton";
import { IProduct } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super({
      collection: "product",
      db: "bstock"
    });
  }
}

export const productRepository = singleton(ProductRepository)
