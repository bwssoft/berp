import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/infra"

class FindOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(input: Partial<IInput>) {
    return await this.repository.findOne(input)
  }
}

export const findOneInputUsecase = singleton(FindOneInputUsecase)
