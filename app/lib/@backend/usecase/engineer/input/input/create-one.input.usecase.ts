import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/infra";

class CreateOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(input: Omit<IInput, "id" | "created_at" | "seq" | "sku">) {
    try {
      const last_input_with_same_category = await this.repository.findOne(
        { "category.id": input.category.id },
        { sort: { seq: -1 }, limit: 1 }
      );

      const seq = (last_input_with_same_category?.seq ?? 0) + 1;

      const _input = Object.assign(input, {
        created_at: new Date(),
        id: crypto.randomUUID(),
        seq,
        sku: `${input.category.code}-${seq}`,
      });

      await this.repository.create(_input);
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
