import IProductionProcess from "@/app/lib/@backend/domain/production/entity/production-process.definition";
import IProductionProcessRepository from "@/app/lib/@backend/domain/production/repository/production-process.repository.interface";
import { productionProcessRepository } from "@/app/lib/@backend/infra";
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
