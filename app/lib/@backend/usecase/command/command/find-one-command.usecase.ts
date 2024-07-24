import { singleton } from "@/app/lib/util/singleton"
import { ICommand, ICommandRepository } from "@/app/lib/@backend/domain"
import { commandRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneCommandUsecase {
  repository: ICommandRepository

  constructor() {
    this.repository = commandRepository
  }

  async execute(args: Partial<ICommand>) {
    return await this.repository.findOne(args)
  }
}

export const findOneCommandUsecase = singleton(FindOneCommandUsecase)
