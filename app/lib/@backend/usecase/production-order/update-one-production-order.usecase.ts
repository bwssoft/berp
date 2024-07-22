import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute(query: { id: string }, value: Omit<IProductionOrder, "id" | "created_at">) {
    return await this.repository.updateOne(query, value)
  }
}

export const updateOneProductionOrderUsecase = singleton(UpdateOneProductionOrderUsecase)
