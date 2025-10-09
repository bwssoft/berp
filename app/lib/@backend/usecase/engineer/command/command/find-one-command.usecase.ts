import { RemoveMongoId } from "@/backend/decorators";
import { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import { ICommandRepository } from "@/backend/domain/engineer/repository/command.repository";
import { commandRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

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

