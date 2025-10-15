import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";
import { IHistorical } from "@/backend/domain/commercial/entity/historical.definition";

class HistoricalRepository extends BaseRepository<IHistorical> {
  constructor() {
    super({
      collection: "commercial.historical",
      db: "berp",
    });
  }
}

export const historicalRepository = singleton(HistoricalRepository);

