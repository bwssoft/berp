import { singleton } from "@/app/lib/util/singleton"
import { ICommand } from "@/app/lib/@backend/domain/engineer/entity/command.definition";
import { ICommandRepository } from "@/app/lib/@backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/app/lib/@backend/infra"

class DeleteOneCommandUsecase {
  repository: ICommandRepository

  constructor() {
    this.repository = commandRepository
  }

  async execute(input: Partial<ICommand>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneCommandUsecase = singleton(DeleteOneCommandUsecase)
