import { IProductionProcessRepository } from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

class FindAllProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllProductionProcessUsecase = singleton(
  FindAllProductionProcessUsecase
);
