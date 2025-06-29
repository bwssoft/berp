import { singleton } from "@/app/lib/util/singleton";
import {
  IProductCategory,
  IProductCategoryRepository,
} from "@/app/lib/@backend/domain";
import { productCategoryRepository } from "@/app/lib/@backend/infra";

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
