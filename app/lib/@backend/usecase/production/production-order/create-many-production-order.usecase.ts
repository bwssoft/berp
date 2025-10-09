import { singleton } from "@/app/lib/util/singleton"
import { IProductionOrder } from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import { IProductionOrderRepository } from "@/app/lib/@backend/domain/production/repository/production-order.repository.interface";
import { productionOrderRepository } from "@/app/lib/@backend/infra"

class CreateManyProductionOrderUsecase {
  repository: IProductionOrderRepository

  constructor() {
    this.repository = productionOrderRepository
  }

  async execute(input: Omit<IProductionOrder, "id" | "created_at" | "code">[]) {
    const last_production_order = await this.repository.findOne({}, {sort: {code: -1}, limit: 1})
    const last_code = last_production_order?.code ?? 0

    const _input: IProductionOrder[] = []
    for(const p in input){
      const production_order = input[p]
      const code = Number(p) + 1 + last_code 
      _input.push(Object.assign(production_order, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        code
      }))
    }

    return await this.repository.createMany(_input)
  }
}

export const createManyProductionOrderUsecase = singleton(CreateManyProductionOrderUsecase)
