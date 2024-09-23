import { IProductionProcessRepository } from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class FindAllProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllProductionProcessUsecase = singleton(
  FindAllProductionProcessUsecase
);
