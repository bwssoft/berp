import { singleton } from "@/app/lib/util/singleton"
import { IProduct, IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute(input: Partial<IProduct>) {
    return await this.repository.findOne(input)
  }
}

export const findOneProductUsecase = singleton(FindOneProductUsecase)
