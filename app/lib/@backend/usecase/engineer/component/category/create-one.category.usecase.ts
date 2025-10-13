
import { singleton } from "@/app/lib/util/singleton";
import type { IComponentCategory } from "@/backend/domain/engineer/entity/component.category.definition";
import type { IComponentCategoryRepository } from "@/backend/domain/engineer/repository/component.category.repository";
import { componentCategoryRepository } from "@/backend/infra";

class CreateOneComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute(
    componentCategory: Omit<IComponentCategory, "id" | "created_at">
  ) {
    try {
      await this.repository.create({
        ...componentCategory,
        id: crypto.randomUUID(),
        created_at: new Date(),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          usecase: error instanceof Error ? error.message : JSON.stringify(error),
        },
      };
    }
  }
}

export const createOneComponentCategoryUsecase = singleton(
  CreateOneComponentCategoryUsecase
);
