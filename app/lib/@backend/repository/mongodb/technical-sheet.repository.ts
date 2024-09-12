import {
  ITechnicalSheet,
  ITechnicalSheetRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "./@base/base";

class ProductionProcessRepository
  extends BaseRepository<ITechnicalSheet>
  implements ITechnicalSheetRepository
{
  constructor() {
    super({
      collection: "technical-sheet",
      db: "berp",
    });
  }
}

export const technicalSheetRepository = singleton(ProductionProcessRepository);
