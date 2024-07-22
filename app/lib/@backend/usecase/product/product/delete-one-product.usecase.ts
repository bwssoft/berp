import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute(product: Partial<IProduct>) {
    return await this.repository.deleteOne(product)
  }
}

export const deleteOneProductUsecase = singleton(DeleteOneProductUsecase)
