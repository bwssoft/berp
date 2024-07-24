import { singleton } from "@/app/lib/util/singleton"
import { ICommandRepository } from "@/app/lib/@backend/domain"
import { commandRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllCommandUsecase {
  repository: ICommandRepository

  constructor() {
    this.repository = commandRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllCommandUsecase = singleton(FindAllCommandUsecase)
