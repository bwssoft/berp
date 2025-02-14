import {
  IProductionOrder,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/infra";
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
