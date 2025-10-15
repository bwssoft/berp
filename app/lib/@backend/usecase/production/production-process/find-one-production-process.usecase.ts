import type { IProductionProcess } from "@/backend/domain/production/entity/production-process.definition";
import type { IProductionProcessRepository } from "@/backend/domain/production/repository/production-process.repository";
import { productionProcessRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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


