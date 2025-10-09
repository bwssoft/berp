import { ICommandRepository } from "@/app/lib/@backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindAllCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  @RemoveMongoId()
  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs
  }
}

export const findAllCommandUsecase = singleton(FindAllCommandUsecase);
