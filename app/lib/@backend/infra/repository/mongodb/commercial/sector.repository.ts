import { singleton } from "@/app/lib/util/singleton";
import { ISector } from "@/app/lib/@backend/domain";
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
