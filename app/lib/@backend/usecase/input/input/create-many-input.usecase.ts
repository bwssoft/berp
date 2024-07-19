import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateManyInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(inputs: Omit<IInput, "id" | "created_at">[]) {
    const _inputs = inputs.map(i => Object.assign(i, {
      created_at: new Date(),
      id: crypto.randomUUID()
    }))
    return await this.repository.createMany(_inputs)
  }
}

export const createManyInputUsecase = singleton(CreateManyInputUsecase)
