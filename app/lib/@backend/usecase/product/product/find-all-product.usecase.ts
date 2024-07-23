import { singleton } from "@/app/lib/util/singleton"
import { IProductRepository } from "@/app/lib/@backend/domain"
import { productRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductUsecase {
  repository: IProductRepository

  constructor() {
    this.repository = productRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllProductUsecase = singleton(FindAllProductUsecase)
