import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllProductionOrderWithInputUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute() {
    return await this.repository.findAllWithProduct()
  }
}

export const findAllProductionOrderWithProductUsecase = singleton(FindAllProductionOrderWithInputUsecase)
