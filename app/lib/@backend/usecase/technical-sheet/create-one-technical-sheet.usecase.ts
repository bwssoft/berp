import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class CreateOneTechnicalSheetUseCase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(args: Omit<ITechnicalSheet, "id" | "created_at">) {
    const productionProcess = Object.assign(args, {
      created_at: new Date(),
      id: crypto.randomUUID(),
    });

    await this.repository.create(productionProcess);

    return productionProcess;
  }
}

export const createOneTechnicalSheetUsecase = singleton(
  CreateOneTechnicalSheetUseCase
);
