
import { singleton } from "@/app/lib/util/singleton";
import type { IItem } from "@/backend/domain/logistic/entity/item.entity";
import type { IItemRepository } from "@/backend/domain/logistic/repository/item.repository";
import { itemRepository } from "@/backend/infra";

class UpdateOneItemUsecase {
  repository: IItemRepository;

  constructor() {
    this.repository = itemRepository;
  }

  async execute(query: { id: string }, value: Omit<IItem, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneItemUsecase = singleton(UpdateOneItemUsecase);
