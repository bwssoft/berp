import { singleton } from "@/app/lib/util/singleton";
import type { IProductCategory } from "@/backend/domain/commercial/entity/product.category.definition";
import type { IProductCategoryRepository } from "@/backend/domain/commercial";
import { productCategoryRepository } from "@/backend/infra";

class DeleteOneProductCategoryUsecase {
  repository: IProductCategoryRepository;

  constructor() {
    this.repository = productCategoryRepository;
  }

  async execute(productCategory: Partial<IProductCategory>) {
    return await this.repository.deleteOne(productCategory);
  }
}

export const deleteOneProductCategoryUsecase = singleton(
  DeleteOneProductCategoryUsecase
);

