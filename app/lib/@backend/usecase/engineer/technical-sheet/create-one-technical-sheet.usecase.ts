
import { singleton } from "@/app/lib/util/singleton";
import type { ITechnicalSheet } from "@/backend/domain/engineer/entity/technical-sheet.definition";
import type { ITechnicalSheetRepository } from "@/backend/domain/engineer/repository/technical-sheet.repository";
import { technicalSheetRepository } from "@/backend/infra";

class CreateOneTechnicalSheetUseCase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(args: Omit<ITechnicalSheet, "id" | "created_at">) {
    const technicalSheet = Object.assign(args, {
      id: crypto.randomUUID(),
      created_at: new Date(),
    });

    await this.repository.create(technicalSheet);

    return technicalSheet;
  }
}

export const createOneTechnicalSheetUsecase = singleton(
  CreateOneTechnicalSheetUseCase
);
