import { singleton } from "@/app/lib/util/singleton"
import { ISaleOrder, ISaleOrderRepository, IProduct } from "@/app/lib/@backend/domain"
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllSaleOrderUsecase {
  repository: ISaleOrderRepository

  constructor() {
    this.repository = saleOrderRepository
  }

  async execute() {
    return await this.repository.findAll()
  }

}

export const findAllSaleOrderUsecase = singleton(FindAllSaleOrderUsecase)
