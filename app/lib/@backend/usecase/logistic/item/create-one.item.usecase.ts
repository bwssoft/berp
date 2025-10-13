
import { singleton } from "@/app/lib/util/singleton";
import type { IItem } from "@/backend/domain/logistic/entity/item.entity";
import type { IItemRepository } from "@/backend/domain/logistic/repository/item.repository";
import { itemRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

namespace Dto {
  export type Input = Omit<IItem, "id" | "created_at">;
  export type Output = { success: boolean; error?: { usecase: string } };
}

class CreateOneItemUsecase {
  private repository: IItemRepository;

  constructor() {
    this.repository = itemRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const item: IItem = {
        ...input,
        id: randomUUID(),
        created_at: new Date(),
      };

      await this.repository.create(item);
      return { success: true };
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

export const createOneItemUsecase = singleton(CreateOneItemUsecase);
