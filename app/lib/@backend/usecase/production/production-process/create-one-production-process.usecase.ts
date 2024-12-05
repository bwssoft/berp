import {
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import { productionProcessRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class CreateOneProductionProcessUseCase {
  repository: IProductionProcessRepository;

  constructor() {
    this.repository = productionProcessRepository;
  }

  async execute(args: Omit<IProductionProcess, "id" | "created_at">) {
    const productionProcess = Object.assign(args, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(productionProcess);

    return productionProcess;
  }
}

export const createOneProductionProcessUsecase = singleton(
  CreateOneProductionProcessUseCase
);
