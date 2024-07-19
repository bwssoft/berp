import { singleton } from "@/app/lib/util/singleton"
import { IInputTransaction, IInputTransactionRepository } from "@/app/lib/@backend/domain"
import { inputTransactionRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneInputTransactionUsecase {
  repository: IInputTransactionRepository

  constructor() {
    this.repository = inputTransactionRepository
  }

  async execute(input: Omit<IInputTransaction, "id" | "created_at">) {
    const client = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(client)
  }
}

export const createOneInputTransactionUsecase = singleton(CreateOneInputTransactionUsecase)
