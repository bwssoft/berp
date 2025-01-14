import { singleton } from "@/app/lib/util";
import { inputCategoryRepository } from "@/app/lib/@backend/infra";
import { IInputCategory, IInputCategoryRepository } from "@/app/lib/@backend/domain";

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