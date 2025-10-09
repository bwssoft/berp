import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { ITechnologyRepository } from "@/backend/domain/engineer/repository/technology.repository";
import { technologyRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveFields } from "@/backend/decorators";
import type { Filter } from "mongodb";

class FindManyTechnologyUsecase {
  repository: ITechnologyRepository;

  constructor() {
    this.repository = technologyRepository;
  }

  @RemoveFields("_id")
  async execute(input: Filter<ITechnology>) {
    const { docs } = await this.repository.findMany(input);
    return docs;
  }
}

export const findManyTechnologyUsecase = singleton(FindManyTechnologyUsecase);

