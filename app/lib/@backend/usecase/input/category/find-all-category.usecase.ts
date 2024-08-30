import { singleton } from "@/app/lib/util/singleton"
import { IInputCategoryRepository } from "../../../domain/input/repository/input-category.repository"
import { inputCategoryRepository } from "../../../repository/mongodb/input/input-category.repository"

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
