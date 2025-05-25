import { singleton } from "@/app/lib/util/singleton";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
import { inputRepository } from "@/app/lib/@backend/infra";

class UpdateOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IInput, "id" | "created_at" | "seq">
  ) {
    try {
      await this.repository.updateOne(query, { $set: value });
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

export const updateOneInputUsecase = singleton(UpdateOneInputUsecase);
