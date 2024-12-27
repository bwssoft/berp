import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/infra"

class UpdateOneProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute(
    query: { id: string },
    value: Omit<IProduct, "id" | "created_at" | "code">
  ) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneProductUsecase = singleton(UpdateOneProductUsecase)
