import { singleton } from "@/app/lib/util/singleton";
import { componentCategoryRepository } from "@/app/lib/@backend/infra";
import {
  IComponentCategory,
  IComponentCategoryRepository,
} from "@/app/lib/@backend/domain";

class DeleteOneComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute(componentCategory: Partial<IComponentCategory>) {
    return await this.repository.deleteOne(componentCategory);
  }
}

export const deleteOneComponentCategoryUsecase = singleton(
  DeleteOneComponentCategoryUsecase
);
