import { singleton } from "@/app/lib/util/singleton";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { BaseRepository } from "../@base";

class SectorRepository extends BaseRepository<ISector> {
  constructor() {
    super({
      collection: "commercial.sector",
      db: "berp",
    });
  }
}

export const sectorRepository = singleton(SectorRepository);

