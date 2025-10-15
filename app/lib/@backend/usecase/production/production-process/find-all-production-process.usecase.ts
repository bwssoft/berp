import type { IProductionProcessRepository } from "@/backend/domain/production/repository/production-process.repository";
import { productionProcessRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

class FindAllProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  @RemoveMongoId()
  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs
  }
}

export const findAllProductionProcessUsecase = singleton(
  FindAllProductionProcessUsecase
);

