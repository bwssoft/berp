import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class FindOneTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  async execute(args: Partial<ITechnicalSheet>) {
    return await this.repository.findOne(args);
  }
}

export const findOneTechnicalSheetUsecase = singleton(
  FindOneTechnicalSheetUsecase
);
