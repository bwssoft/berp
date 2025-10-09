import { IProductionProcessRepository } from "@/app/lib/@backend/domain/production/repository/production-process.repository.interface";
import { productionProcessRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
