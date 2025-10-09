import ITechnicalSheet from "@/backend/domain/engineer/entity/technical-sheet.definition";
import type { ITechnicalSheetRepository } from "@/backend/domain/engineer/repository/technical-sheet.repository";
import { technicalSheetRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class DeleteOneTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(input: Partial<ITechnicalSheet>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneTechnicalSheetUsecase = singleton(
  DeleteOneTechnicalSheetUsecase
);


