import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";
import { IHistorical } from "@/app/lib/@backend/domain";

class HistoricalRepository extends BaseRepository<IHistorical> {
  constructor() {
    super({
      collection: "commercial.historical",
      db: "berp",
    });
  }
}

export const historicalRepository = singleton(HistoricalRepository);
