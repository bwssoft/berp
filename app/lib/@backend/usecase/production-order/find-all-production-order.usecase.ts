import { IProductionOrderRepository } from "@/app/lib/@backend/domain";
import { productionOrderRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

class FindAllProductionOrderUsecase {
  repository: IProductionOrderRepository;

  constructor() {
    this.repository = productionOrderRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll({
      active: true,
    });
  }
}

export const findAllProductionOrderUsecase = singleton(
  FindAllProductionOrderUsecase
);
