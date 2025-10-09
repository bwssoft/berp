import { singleton } from "@/app/lib/util/singleton";
import type { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import { productionOrderRepository } from "@/backend/infra";

class CreateOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  async execute(input: Omit<IProductionOrder, "id" | "created_at" | "code">) {
    const last_production_order = await this.repository.findOne(
      {},
      { sort: { code: -1 }, limit: 1 }
    );

    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      code: (last_production_order?.code ?? 0) + 1,
    });

    return await this.repository.create(_input);
  }
}

export const createOneProductionOrderUsecase = singleton(
  CreateOneProductionOrderUsecase
);


