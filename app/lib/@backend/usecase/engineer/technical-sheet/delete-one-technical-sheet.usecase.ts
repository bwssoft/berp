import ITechnicalSheet from "@/app/lib/@backend/domain/engineer/entity/technical-sheet.definition";
import ITechnicalSheetRepository from "@/app/lib/@backend/domain/engineer/repository/technical-sheet.repository.interface";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
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
