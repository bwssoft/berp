import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(query: { id: string }, value: Omit<IInput, "id" | "created_at" | "code">) {
    return await this.repository.updateOne(query, value)
  }
}

export const updateOneInputUsecase = singleton(UpdateOneInputUsecase)
