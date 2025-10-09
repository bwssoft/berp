import { singleton } from "@/app/lib/util";
import { BaseRepository } from "../@base";
import { IProductCategory } from "@/app/lib/@backend/domain/commercial/entity/product.category.definition";

class IProductCategoryRepository extends BaseRepository<IProductCategory> {
  constructor() {
    super({
      collection: "commercial.product.category",
      db: "berp",
    });
  }
}

export const productCategoryRepository = singleton(IProductCategoryRepository);
