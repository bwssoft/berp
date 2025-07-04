import { singleton } from "@/app/lib/util";
import { componentCategoryRepository } from "@/app/lib/@backend/infra";
import {
  IComponentCategory,
  IComponentCategoryRepository,
} from "@/app/lib/@backend/domain";

class CreateManyComponentCategoryUsecase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute(input: Omit<IComponentCategory, "id" | "created_at">[]) {
    const _input = input.map((i) =>
      Object.assign(i, {
        created_at: new Date(),
        id: crypto.randomUUID(),
      })
    );

    return await this.repository.createMany(_input);
  }
}

export const createManyComponentCategoryUsecase = singleton(
  CreateManyComponentCategoryUsecase
);
