
import { singleton } from "@/app/lib/util/singleton";
import type { IComponentCategory } from "@/backend/domain/engineer/entity/component.category.definition";
import type { IComponentCategoryRepository } from "@/backend/domain/engineer/repository/component.category.repository";
import { componentCategoryRepository } from "@/backend/infra";

class CreateManyComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute(input: Omit<IComponentCategory, "id" | "created_at">[]) {
    const payload = input.map((category) =>
      Object.assign(category, {
        id: crypto.randomUUID(),
        created_at: new Date(),
      })
    );

    return await this.repository.createMany(payload);
  }
}

export const createManyComponentCategoryUsecase = singleton(
  CreateManyComponentCategoryUsecase
);
