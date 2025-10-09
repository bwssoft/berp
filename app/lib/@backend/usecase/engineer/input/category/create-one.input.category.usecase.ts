import { singleton } from "@/app/lib/util/singleton";

import { inputCategoryRepository } from "@/app/lib/@backend/infra";

class CreateOneInputCategoryUsecase {
  repository: IInputCategoryRepository;

  constructor() {
    this.repository = inputCategoryRepository;
  }

  async execute(
    inputCategory: Omit<IInputCategory, "id" | "created_at" | "seq">
  ) {
    try {
      const _inputCategory = Object.assign(inputCategory, {
        created_at: new Date(),
        id: crypto.randomUUID(),
      });

      await this.repository.create(_inputCategory);
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
