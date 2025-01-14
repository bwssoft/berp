import { ICommandRepository } from "@/app/lib/@backend/domain";
import { commandRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;

class FindAllCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllCommandUsecase = singleton(FindAllCommandUsecase);
