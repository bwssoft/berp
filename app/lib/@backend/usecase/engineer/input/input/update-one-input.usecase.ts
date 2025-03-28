import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/infra"

class UpdateOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(query: { id: string }, value: Omit<IInput, "id" | "created_at" | "code">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneInputUsecase = singleton(UpdateOneInputUsecase)
