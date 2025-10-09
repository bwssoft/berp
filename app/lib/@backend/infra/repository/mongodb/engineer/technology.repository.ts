import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { ITechnologyRepository } from "@/backend/domain/engineer/repository/technology.repository";
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

