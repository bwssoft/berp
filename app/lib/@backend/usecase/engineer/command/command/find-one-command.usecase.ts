import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { ICommand } from "@/app/lib/@backend/domain/engineer/entity/command.definition";
import { ICommandRepository } from "@/app/lib/@backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/app/lib/@backend/infra";
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
