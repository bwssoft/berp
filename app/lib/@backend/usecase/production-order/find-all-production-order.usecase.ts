import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllProductionOrderUsecase = singleton(FindAllProductionOrderUsecase)
