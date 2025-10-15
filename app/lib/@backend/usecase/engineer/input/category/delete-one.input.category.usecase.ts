
import { singleton } from "@/app/lib/util/singleton";
import type { IInputCategory } from "@/backend/domain/engineer/entity/input.category.definition";
import type { IInputCategoryRepository } from "@/backend/domain/engineer/repository/input.category.repository";
import { inputCategoryRepository } from "@/backend/infra";

class DeleteOneInputCategoryUsecase {
  repository: IInputCategoryRepository;

  constructor() {
    this.repository = inputCategoryRepository;
  }

  async execute(inputCategory: Partial<IInputCategory>) {
    return await this.repository.deleteOne(inputCategory);
  }
}

export const deleteOneInputCategoryUsecase = singleton(
  DeleteOneInputCategoryUsecase
);
