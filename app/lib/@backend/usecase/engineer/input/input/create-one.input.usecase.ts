import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/infra";

class CreateOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(Input: Omit<IInput, "id" | "created_at" | "seq">) {
    try {
      const last_Input_with_same_category = await this.repository.findOne(
        { "category.id": Input.category.id },
        { sort: { seq: -1 }, limit: 1 }
      );

      const _Input = Object.assign(Input, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        seq: (last_Input_with_same_category?.seq ?? 0) + 1,
      });

      await this.repository.create(_Input);
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

export const createOneInputUsecase = singleton(CreateOneInputUsecase);
