import { singleton } from "@/app/lib/util/singleton"
import { inputCategoryRepository } from "@/app/lib/@backend/infra"
import { IInputCategory, IInputCategoryRepository } from "@/app/lib/@backend/domain"


class CreateOneInputCategoryUsecase {
  repository: IInputCategoryRepository

  constructor() {
    this.repository = inputCategoryRepository
  }

  async execute(inputCategory: Omit<IInputCategory, "id" | "created_at">) {
    return await this.repository.create({
      ...inputCategory,
      created_at: new Date(),
      id: crypto.randomUUID()
    })
  }
}

export const createOneInputCategoryUsecase = singleton(CreateOneInputCategoryUsecase)
