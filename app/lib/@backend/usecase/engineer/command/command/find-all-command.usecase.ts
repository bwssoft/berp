import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { ICommandRepository } from "@/backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/backend/infra";

class FindAllCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  @RemoveMongoId()
  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs;
  }
}

export const findAllCommandUsecase = singleton(FindAllCommandUsecase);

