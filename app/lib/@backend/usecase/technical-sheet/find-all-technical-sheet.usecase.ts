import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { technicalSheetRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "../../decorators";

class FindAllTechnicalSheetUsecase {
  repository: ITechnicalSheetRepository;

  constructor() {
    this.repository = technicalSheetRepository;
  }

  @RemoveMongoId()
  async execute(params: Filter<ITechnicalSheet>) {
    return await this.repository.findAll(params);
  }
}

export const findAllTechnicalSheetUsecase = singleton(
  FindAllTechnicalSheetUsecase
);
