import type { IProductionProcess } from "@/backend/domain/production/entity/production-process.definition";
import type { IProductionProcessRepository } from "@/backend/domain/production/repository/production-process.repository";
import { productionProcessRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class DeleteOneProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  async execute(input: Partial<IProductionProcess>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneProductionProcessUsecase = singleton(
  DeleteOneProductionProcessUsecase
);


