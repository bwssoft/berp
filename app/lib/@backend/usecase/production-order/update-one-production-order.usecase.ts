import {
  IProductionOrder,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IProductionOrder, "id" | "created_at">>
  ) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneProductionOrderUsecase = singleton(
  UpdateOneProductionOrderUsecase
);
