import { singleton } from "@/app/lib/util/singleton"
import { IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllInputUsecase = singleton(FindAllInputUsecase)
