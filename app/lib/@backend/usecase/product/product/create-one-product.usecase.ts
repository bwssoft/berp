import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute(input: Omit<IProduct, "id" | "created_at">) {
    const product = Object.assign(
      input,
      {
        created_at: new Date(),
        id: crypto.randomUUID()
      }
    )
    await this.repository.create(product)
    return product
  }
}

export const createOneProductUsecase = singleton(CreateOneProductUsecase)
