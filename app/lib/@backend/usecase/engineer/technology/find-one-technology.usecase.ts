import { ITechnology } from "@/app/lib/@backend/domain/engineer/entity/technology.definition";
import { ITechnologyRepository } from "@/app/lib/@backend/domain/engineer/repository/technology.repository.interface";
import { technologyRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindOneTechnologyUsecase {
  repository: ITechnologyRepository;

  constructor() {
    this.repository = technologyRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<ITechnology>) {
    return await this.repository.findOne(input);
  }
}

export const findOneTechnologyUsecase = singleton(FindOneTechnologyUsecase);
