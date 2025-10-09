import ITechnicalSheet from "@/backend/domain/engineer/entity/technical-sheet.definition";
import type { ITechnicalSheetRepository } from "@/backend/domain/engineer/repository/technical-sheet.repository";
import { technicalSheetRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<ITechnicalSheet, "id" | "created_at">>
  ) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneTechnicalSheetUsecase = singleton(
  UpdateOneTechnicalSheetUsecase
);


