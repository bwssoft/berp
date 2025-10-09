import type { ITechnicalSheet } from "@/backend/domain/engineer/entity/technical-sheet.definition";
import type { ITechnicalSheetRepository } from "@/backend/domain/engineer/repository/technical-sheet.repository";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class TechnicalSheetRepository
  extends BaseRepository<ITechnicalSheet>
  implements ITechnicalSheetRepository {
  constructor() {
    super({
      collection: "technical-sheet",
      db: "berp",
    });
  }
}

export const technicalSheetRepository = singleton(TechnicalSheetRepository);


