
import { singleton } from "@/app/lib/util/singleton";
import type { IBase } from "@/backend/domain/logistic/entity/base.entity";
import type { ILogisticBaseRepository } from "@/backend/domain/logistic/repository/base.repository";
import { baseRepository } from "@/backend/infra";

class UpdateOneBaseUsecase {
  repository: ILogisticBaseRepository;

  constructor() {
    this.repository = baseRepository;
  }

  async execute(query: { id: string }, value: Omit<IBase, "id" | "created_at">) {
    try {
      await this.repository.updateOne(query, { $set: value });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const updateOneBaseUsecase = singleton(UpdateOneBaseUsecase);
