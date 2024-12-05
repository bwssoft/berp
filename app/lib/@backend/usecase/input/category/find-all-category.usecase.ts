import { singleton } from "@/app/lib/util/singleton"
import { IInputCategoryRepository } from "../../../domain/engineer/repository/input-category.repository"
import { inputCategoryRepository } from "@/app/lib/@backend/infra"

class FindAllInputCategoriesUseCase {
  repository: IInputCategoryRepository

  constructor() {
    this.repository = inputCategoryRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllInputCategoriesUseCase = singleton(FindAllInputCategoriesUseCase)
