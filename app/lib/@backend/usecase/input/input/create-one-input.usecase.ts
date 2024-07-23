import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(input: Omit<IInput, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(client)
  }
}

export const createOneInputUsecase = singleton(CreateOneInputUsecase)
