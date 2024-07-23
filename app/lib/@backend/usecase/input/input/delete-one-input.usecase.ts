import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class DeleteOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(input: Partial<IInput>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneInputUsecase = singleton(DeleteOneInputUsecase)
