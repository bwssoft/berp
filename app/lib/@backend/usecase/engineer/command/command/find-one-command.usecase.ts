import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import type { ICommandRepository } from "@/backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/backend/infra";

class FindOneCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<ICommand>) {
    return await this.repository.findOne(args);
  }
}

export const findOneCommandUsecase = singleton(FindOneCommandUsecase);

