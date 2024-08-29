import { singleton } from "@/app/lib/util";
import { inputCategoryRepository } from "../../../repository/mongodb/input/input-category.repository";
import { IINputCategoryRepository } from "../../../domain/input/repository/input-category.repository";
import { IInputCategory } from "../../../domain/input/entity/input-category.definition";

class CreateManyInputCategory {
  repository: IINputCategoryRepository;

  constructor() {
    this.repository = inputCategoryRepository
  }

  async execute(inputs: Omit<IInputCategory, "id" | "created_at">[]) {
    const _inputs = inputs.map(i => Object.assign(i, {
      created_at: new Date(),
      id: crypto.randomUUID()
    }))

    return await this.repository.createMany(_inputs);
  }
}

export const createManyCategoryUsecase = singleton(CreateManyInputCategory)