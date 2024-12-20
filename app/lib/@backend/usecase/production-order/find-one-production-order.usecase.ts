import {
  IProductionOrder,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

class FindOneProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<IProductionOrder>) {
    return await this.repository.findOne({ active: true, ...args });
  }
}

export const findOneProductionOrderUsecase = singleton(
  FindOneProductionOrderUsecase
);
