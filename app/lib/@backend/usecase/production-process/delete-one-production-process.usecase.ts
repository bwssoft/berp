import {
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/repository/mongodb";
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
