import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute(input: Partial<IProductionOrder>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneProductionOrderUsecase = singleton(DeleteOneProductionOrderUsecase)
