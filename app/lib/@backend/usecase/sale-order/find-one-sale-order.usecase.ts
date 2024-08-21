import { singleton } from "@/app/lib/util/singleton"
import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain"
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneSaleOrderUsecase {
  repository: ISaleOrderRepository

  constructor() {
    this.repository = saleOrderRepository
  }

  async execute(input: Partial<ISaleOrder>) {
    return await this.repository.findOne(input)
  }

}

export const findOneSaleOrderUsecase = singleton(FindOneSaleOrderUsecase)
