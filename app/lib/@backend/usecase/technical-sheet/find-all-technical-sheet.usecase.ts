import { ITechnicalSheetRepository } from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class FindAllTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllTechnicalSheetUsecase = singleton(
  FindAllTechnicalSheetUsecase
);
