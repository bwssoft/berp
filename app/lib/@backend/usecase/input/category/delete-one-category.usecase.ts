import { singleton } from "@/app/lib/util/singleton"
import { IInputCategory } from "../../../domain/engineer/entity/input-category.definition"
import { IInputCategoryRepository } from "../../../domain/engineer/repository/input-category.repository"
import { inputCategoryRepository } from "@/app/lib/@backend/infra"

class DeleteOneInputCategoryUsecase {
  repository: IInputCategoryRepository

  constructor() {
    this.repository = inputCategoryRepository
  }

  async execute(inputCategory: Partial<IInputCategory>) {
    return await this.repository.deleteOne(inputCategory)
  }
}

export const deleteOneInputCategoryUsecase = singleton(DeleteOneInputCategoryUsecase)
