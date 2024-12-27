import { singleton } from "@/app/lib/util";
import { BaseRepository } from "../@base";
import { IProductCategory } from "@/app/lib/@backend/domain";

class IProductCategoryRepository extends BaseRepository<IProductCategory> {
  constructor() {
    super({
      collection: "product-category",
      db: "berp"
    })
  }
}

export const productCategoryRepository = singleton(IProductCategoryRepository)