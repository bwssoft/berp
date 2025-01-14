import { singleton } from "@/app/lib/util/singleton"
import { productCategoryRepository } from "@/app/lib/@backend/infra"
import { IProductCategory, IProductCategoryRepository } from "@/app/lib/@backend/domain"


class CreateOneProductCategoryUsecase {
  repository: IProductCategoryRepository

  constructor() {
    this.repository = productCategoryRepository
  }

  async execute(input: Omit<IProductCategory, "id" | "created_at">) {
    return await this.repository.create({
      ...input,
      created_at: new Date(),
      id: crypto.randomUUID()
    })
  }
}

export const createOneProductCategoryUsecase = singleton(CreateOneProductCategoryUsecase)
