import { singleton } from "@/app/lib/util/singleton"
import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain"
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneSaleOrderUsecase {
  repository: ISaleOrderRepository

  constructor() {
    this.repository = saleOrderRepository
  }

  async execute(input: Partial<ISaleOrder>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneSaleOrderUsecase = singleton(DeleteOneSaleOrderUsecase)
