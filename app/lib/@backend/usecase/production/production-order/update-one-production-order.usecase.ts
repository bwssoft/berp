import type { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import { productionOrderRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { UpdateFilter } from "mongodb";

class UpdateOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  async execute(
    query: { id: string },
    value: UpdateFilter<Omit<IProductionOrder, "id" | "created_at">>
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneProductionOrderUsecase = singleton(
  UpdateOneProductionOrderUsecase
);


