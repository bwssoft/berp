import { singleton } from "@/app/lib/util/singleton"
import { IProductTransaction, IProductTransactionRepository } from "@/app/lib/@backend/domain"
import { productTransactionRepository } from "@/app/lib/@backend/infra"

class CreateOneProductTransactionUsecase {
  repository: IProductTransactionRepository

  constructor() {
    this.repository = productTransactionRepository
  }

  async execute(arg: Omit<IProductTransaction, "id" | "created_at">) {
    const product = Object.assign(
      arg,
      {
        created_at: new Date(),
        id: crypto.randomUUID()
      }
    )
    await this.repository.create(product)
    return product
  }
}

export const createOneProductTransactionUsecase = singleton(CreateOneProductTransactionUsecase)
