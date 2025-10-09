import ITechnicalSheet from "@/backend/domain/engineer/entity/technical-sheet.definition";
import type { ITechnicalSheetRepository } from "@/backend/domain/engineer/repository/technical-sheet.repository";
import { technicalSheetRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";

class FindAllTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  @RemoveMongoId()
  async execute(params: Filter<ITechnicalSheet>) {
    const { docs } = await this.repository.findMany(params);
    return docs
  }
}

export const findAllTechnicalSheetUsecase = singleton(
  FindAllTechnicalSheetUsecase
);


