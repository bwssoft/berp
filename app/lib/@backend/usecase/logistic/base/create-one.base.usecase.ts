
import { singleton } from "@/app/lib/util/singleton";
import type { IBase } from "@/backend/domain/logistic/entity/base.entity";
import type { ILogisticBaseRepository } from "@/backend/domain/logistic/repository/base.repository";
import { baseRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

namespace Dto {
  export type Input = Omit<IBase, "id" | "created_at">;
  export type Output = { success: boolean; error?: { global: string } };
}

class CreateOneBaseUsecase {
  private repository: ILogisticBaseRepository;

  constructor() {
    this.repository = baseRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const base: IBase = {
        ...input,
        id: randomUUID(),
        created_at: new Date(),
      };

      await this.repository.create(base);
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

export const createOneBaseUsecase = singleton(CreateOneBaseUsecase);
