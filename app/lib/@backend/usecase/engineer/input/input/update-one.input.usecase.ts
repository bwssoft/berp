import { singleton } from "@/app/lib/util/singleton";
import { IInput } from "@/backend/domain/engineer/entity/input.definition";
import { IInputRepository } from "@/backend/domain/engineer/repository/input.repository";
import { inputRepository } from "@/backend/infra";

class UpdateOneInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IInput, "id" | "created_at" | "seq" | "sku">
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

