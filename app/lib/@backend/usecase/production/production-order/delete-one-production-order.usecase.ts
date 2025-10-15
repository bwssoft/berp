import type { IProductionOrder } from "@/backend/domain/production/entity/production-order.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import {
  productionOrderRepository,
} from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class DeleteOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  async execute(input: Partial<IProductionOrder>) {
    try {
      await this.repository.deleteOne(input);
    } catch (error) {
      throw new Error(
        "Error in DeleteOneProductionOrderUsecase, execute method"
      );
    }
  }
}

export const deleteOneProductionOrderUsecase = singleton(
  DeleteOneProductionOrderUsecase
);


