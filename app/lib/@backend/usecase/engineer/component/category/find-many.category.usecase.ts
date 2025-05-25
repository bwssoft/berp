import { singleton } from "@/app/lib/util/singleton";
import { componentCategoryRepository } from "@/app/lib/@backend/infra";
import { IComponentCategoryRepository } from "@/app/lib/@backend/domain";

class FindManyComponentCategoryUseCase {
  repository: IComponentCategoryRepository;

  constructor() {
    this.repository = componentCategoryRepository;
  }

  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs;
  }
}

export const findManyComponentCategoryUseCase = singleton(
  FindManyComponentCategoryUseCase
);
