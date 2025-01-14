import { singleton } from "@/app/lib/util/singleton"
import { inputCategoryRepository } from "@/app/lib/@backend/infra"
import { IInputCategoryRepository } from "@/app/lib/@backend/domain"

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
