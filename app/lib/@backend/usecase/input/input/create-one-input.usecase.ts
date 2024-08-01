import { singleton } from "@/app/lib/util/singleton"
import { IInput, IInputRepository } from "@/app/lib/@backend/domain"
import { inputRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneInputUsecase {
  repository: IInputRepository

  constructor() {
    this.repository = inputRepository
  }

  async execute(input: Omit<IInput, "id" | "created_at" | "code">) {
    const aggregate = await this.repository.aggregate([
      { $match: { category: input.category } },
      { $sort: { code: -1 } },
      { $limit: 1 }
    ])

    const [last_input_with_same_category] = await aggregate.toArray() as IInput[]

    const _input = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      code: (last_input_with_same_category.code ?? 0) + 1
    })

    return await this.repository.create(_input)
  }
}

export const createOneInputUsecase = singleton(CreateOneInputUsecase)
