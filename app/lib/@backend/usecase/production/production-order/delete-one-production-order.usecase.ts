import IProductionOrder from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import IProductionOrderRepository from "@/app/lib/@backend/domain/production/repository/production-order.repository.interface";
import {
  productionOrderRepository,
} from "@/app/lib/@backend/infra";
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
