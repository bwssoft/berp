
import { singleton } from "@/app/lib/util/singleton";
import type { IInputCategory } from "@/backend/domain/engineer/entity/input.category.definition";
import type { IInputCategoryRepository } from "@/backend/domain/engineer/repository/input.category.repository";
import { inputCategoryRepository } from "@/backend/infra";

class CreateOneInputCategoryUsecase {
  repository: IInputCategoryRepository;

  constructor() {
    this.repository = inputCategoryRepository;
  }

  async execute(
    inputCategory: Omit<IInputCategory, "id" | "created_at" | "seq">
  ) {
    try {
      const payload = Object.assign(inputCategory, {
        id: crypto.randomUUID(),
        created_at: new Date(),
      });

      await this.repository.create(payload);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          usecase: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const createOneInputCategoryUsecase = singleton(
  CreateOneInputCategoryUsecase
);
