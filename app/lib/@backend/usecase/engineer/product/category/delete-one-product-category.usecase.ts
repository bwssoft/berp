import { singleton } from "@/app/lib/util/singleton"
import { productCategoryRepository } from "@/app/lib/@backend/infra"
import { IProductCategory, IProductCategoryRepository } from "@/app/lib/@backend/domain"

class DeleteOneProductCategoryUsecase {
  repository: IProductCategoryRepository

  constructor() {
    this.repository = productCategoryRepository
  }

  async execute(input: Partial<IProductCategory>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneProductCategoryUsecase = singleton(DeleteOneProductCategoryUsecase)
