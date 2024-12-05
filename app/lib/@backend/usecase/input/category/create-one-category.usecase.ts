import { singleton } from "@/app/lib/util/singleton"
import { IInputCategory } from "../../../domain/engineer/entity/input-category.definition"
import { IInputCategoryRepository } from "../../../domain/engineer/repository/input-category.repository"
import { inputCategoryRepository } from "@/app/lib/@backend/infra"


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
