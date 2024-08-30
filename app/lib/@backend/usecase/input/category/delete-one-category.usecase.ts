import { singleton } from "@/app/lib/util/singleton"
import { IInputCategory } from "../../../domain/input/entity/input-category.definition"
import { IInputCategoryRepository } from "../../../domain/input/repository/input-category.repository"
import { inputCategoryRepository } from "../../../repository/mongodb/input/input-category.repository"

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
