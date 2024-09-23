import {
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class FindOneProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  async execute(args: Partial<IProductionProcess>) {
    return await this.repository.findOne(args);
  }
}

export const findOneProductionProcessUsecase = singleton(
  FindOneProductionProcessUsecase
);
