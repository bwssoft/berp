import { ITechnology } from "@/app/lib/@backend/domain/engineer/entity/technology.definition";
import { ITechnologyRepository } from "@/app/lib/@backend/domain/engineer/repository/technology.repository.interface";
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
