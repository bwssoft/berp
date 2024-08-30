import { singleton } from "@/app/lib/util";
import { IInputCategory } from "../../../domain/input/entity/input-category.definition";
import { IInputCategoryRepository } from "../../../domain/input/repository/input-category.repository";
import { inputCategoryRepository } from "../../../repository/mongodb/input/input-category.repository";

class CreateManyInputCategory {
  repository: IInputCategoryRepository;

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