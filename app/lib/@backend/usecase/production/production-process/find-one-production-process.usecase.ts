import {
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindOneProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<IProductionProcess>) {
    return await this.repository.findOne(args);
  }
}

export const findOneProductionProcessUsecase = singleton(
  FindOneProductionProcessUsecase
);
