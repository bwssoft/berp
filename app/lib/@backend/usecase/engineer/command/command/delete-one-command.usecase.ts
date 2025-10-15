import { singleton } from "@/app/lib/util/singleton";
import type { ICommand } from "@/backend/domain/engineer/entity/command.definition";
import type { ICommandRepository } from "@/backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/backend/infra";

class DeleteOneCommandUsecase {
  repository: ICommandRepository;

  constructor() {
    this.repository = commandRepository;
  }

  async execute(input: Partial<ICommand>) {
    return await this.repository.deleteOne(input);
  }
}

export const deleteOneCommandUsecase = singleton(DeleteOneCommandUsecase);

