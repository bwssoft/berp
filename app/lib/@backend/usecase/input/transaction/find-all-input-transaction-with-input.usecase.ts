import { singleton } from "@/app/lib/util/singleton"
import { IInputTransactionRepository } from "@/app/lib/@backend/domain"
import { inputTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllInputTransactionWithInputUsecase {
  repository: IInputTransactionRepository

  constructor() {
    this.repository = inputTransactionRepository
  }

  async execute() {
    return await this.repository.findAllWithInput()
  }
}

export const findAllInputTransactionWithInputUsecase = singleton(FindAllInputTransactionWithInputUsecase)
