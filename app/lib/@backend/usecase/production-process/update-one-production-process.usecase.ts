import {
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneProductionProcessUsecase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IProductionProcess, "id" | "created_at">>
  ) {
    return await this.repository.updateOne(query, value);
  }
}

export const updateOneProductionProcessUsecase = singleton(
  UpdateOneProductionProcessUsecase
);
