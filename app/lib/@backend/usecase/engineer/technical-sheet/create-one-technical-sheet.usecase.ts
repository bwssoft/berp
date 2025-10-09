import ITechnicalSheet from "@/app/lib/@backend/domain/engineer/entity/technical-sheet.definition";
import ITechnicalSheetRepository from "@/app/lib/@backend/domain/engineer/repository/technical-sheet.repository.interface";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
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
