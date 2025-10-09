import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { ITechnologyRepository } from "@/backend/domain/engineer/repository/technology.repository";
import { technologyRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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

