import { singleton } from "@/app/lib/util/singleton"
import { ICommand } from "@/app/lib/@backend/domain/engineer/entity/command.definition";
import { ICommandRepository } from "@/app/lib/@backend/domain/engineer/repository/command.repository.interface";
import { commandRepository } from "@/app/lib/@backend/infra"

class CreateOneCommandUsecase {
  repository: ICommandRepository

  constructor() {
    this.repository = commandRepository
  }

  async execute(command: Omit<ICommand, "id" | "created_at">) {
    const _command = Object.assign(
      command,
      {
        id: crypto.randomUUID(),
        created_at: new Date()
      }
    )
    await this.repository.create(_command)

    return command
  }
}

export const createOneCommandUsecase = singleton(CreateOneCommandUsecase)
