import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrder, IProductionOrderRepository } from "@/app/lib/@backend/domain"
import { productionOrderRepository } from "@/app/lib/@backend/infra"

class CreateOneProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute(args: Omit<IProductionOrder, "id" | "created_at">) {
    const productionOrder = Object.assign(
      args,
      {
        created_at: new Date(),
        id: crypto.randomUUID()
      }
    )
    await this.repository.create(productionOrder)

    return productionOrder
  }
}

export const createOneProductionOrderUsecase = singleton(CreateOneProductionOrderUsecase)
