import { ITechnology, ITechnologyRepository } from "@/app/lib/@backend/domain";
import { technologyRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import type { Filter } from "mongodb";

class FindManyTechnologyUsecase {
  repository: ITechnologyRepository;

  constructor() {
    this.repository = technologyRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<ITechnology>) {
    const { docs } = await this.repository.findMany(input);
    return docs
  }
}

export const findManyTechnologyUsecase = singleton(FindManyTechnologyUsecase);
