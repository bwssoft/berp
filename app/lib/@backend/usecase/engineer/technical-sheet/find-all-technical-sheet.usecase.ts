import ITechnicalSheet from "@/app/lib/@backend/domain/engineer/entity/technical-sheet.definition";
import ITechnicalSheetRepository from "@/app/lib/@backend/domain/engineer/repository/technical-sheet.repository.interface";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
