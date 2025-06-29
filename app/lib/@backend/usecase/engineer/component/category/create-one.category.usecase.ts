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
    try {
      await this.repository.create({
        ...componentCategory,
        created_at: new Date(),
        id: crypto.randomUUID(),
      });
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: {
          usecase: e instanceof Error ? e.message : JSON.stringify(e),
        },
      };
    }
  }
}

export const createOneComponentCategoryUsecase = singleton(
  CreateOneComponentCategoryUsecase
);
