import { ITechnologyRepository } from "@/app/lib/@backend/domain";
import { technologyRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindManyTechnologyUsecase {
  repository: ITechnologyRepository;

  constructor() {
    this.repository = technologyRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findManyTechnologyUsecase = singleton(FindManyTechnologyUsecase);
