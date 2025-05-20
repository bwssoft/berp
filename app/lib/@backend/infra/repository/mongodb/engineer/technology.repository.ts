import { ITechnology, ITechnologyRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class TechnologyRepository
  extends BaseRepository<ITechnology>
  implements ITechnologyRepository
{
  constructor() {
    super({
      collection: "engineer.technology",
      db: "berp",
    });
  }
}

export const technologyRepository = singleton(TechnologyRepository);
