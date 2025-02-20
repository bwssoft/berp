import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
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
