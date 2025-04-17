import { singleton } from "@/app/lib/util/singleton"
import { productCategoryRepository } from "@/app/lib/@backend/infra"
import { IProductCategory, IProductCategoryRepository } from "@/app/lib/@backend/domain"
import { RemoveMongoId } from "@/app/lib/@backend/decorators"

class FindManyProductCategoriesUseCase {
  repository: IProductCategoryRepository

  constructor() {
    this.repository = productCategoryRepository
  }

  @RemoveMongoId()
  async execute(input: Partial<IProductCategory>) {
    return await this.repository.findMany(input)
  }
}

export const findManyProductCategoriesUseCase = singleton(FindManyProductCategoriesUseCase)
