import { singleton } from "@/app/lib/util/singleton"
import { ISaleOrder, ISaleOrderRepository } from "@/app/lib/@backend/domain"
import { saleOrderRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneSaleOrderUsecase {
  repository: ISaleOrderRepository

  constructor() {
    this.repository = saleOrderRepository
  }

  async execute(query: { id: string }, value: Omit<ISaleOrder, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneSaleOrderUsecase = singleton(UpdateOneSaleOrderUsecase)
