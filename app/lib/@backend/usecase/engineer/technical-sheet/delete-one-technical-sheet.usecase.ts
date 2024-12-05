import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
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
