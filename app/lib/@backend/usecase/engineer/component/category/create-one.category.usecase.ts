import { singleton } from "@/app/lib/util/singleton";
import { componentCategoryRepository } from "@/app/lib/@backend/infra";
import {
  IComponentCategory,
  IComponentCategoryRepository,
} from "@/app/lib/@backend/domain";

class CreateOneComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute(
    componentCategory: Omit<IComponentCategory, "id" | "created_at">
  ) {
    return await this.repository.create({
      ...componentCategory,
      created_at: new Date(),
      id: crypto.randomUUID(),
    });
  }
}

export const createOneComponentCategoryUsecase = singleton(
  CreateOneComponentCategoryUsecase
);
