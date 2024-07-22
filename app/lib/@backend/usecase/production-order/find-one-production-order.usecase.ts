import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute(args: Partial<IProductionOrder>) {
    return await this.repository.findOne(args)
  }
}

export const findOneProductionOrderUsecase = singleton(FindOneProductionOrderUsecase)
