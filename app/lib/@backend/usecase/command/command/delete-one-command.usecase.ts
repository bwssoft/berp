import { singleton } from "@/app/lib/util/singleton"
import { ICommand, ICommandRepository } from "@/app/lib/@backend/domain"
import { commandRepository } from "@/app/lib/@backend/repository/mongodb"

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
