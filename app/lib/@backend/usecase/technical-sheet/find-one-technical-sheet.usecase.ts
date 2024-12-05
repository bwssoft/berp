import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../decorators";

class FindOneTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<ITechnicalSheet>) {
    return await this.repository.findOne(args);
  }
}

export const findOneTechnicalSheetUsecase = singleton(
  FindOneTechnicalSheetUsecase
);
