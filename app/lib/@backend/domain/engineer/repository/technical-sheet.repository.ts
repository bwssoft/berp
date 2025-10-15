import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { ITechnicalSheet } from "@/backend/domain/engineer/entity/technical-sheet.definition";

export interface ITechnicalSheetRepository
  extends IBaseRepository<ITechnicalSheet> {}
