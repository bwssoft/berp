import { singleton } from "@/app/lib/util/singleton"
import { IProductTransactionRepository } from "@/app/lib/@backend/domain"
import { productTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductTransactionWithProductUsecase {
  repository: IProductTransactionRepository

  constructor() {
    this.repository = productTransactionRepository
  }

  async execute() {
    return await this.repository.findAllWithProduct()
  }
}

export const findAllProductTransactionWithProductUsecase = singleton(FindAllProductTransactionWithProductUsecase)
