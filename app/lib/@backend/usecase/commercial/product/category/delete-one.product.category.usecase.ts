import { singleton } from "@/app/lib/util/singleton";

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

