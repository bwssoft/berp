import type { IItem } from "@/backend/domain/logistic/entity/item.entity";
import type { IItemRepository } from "@/backend/domain/logistic/repository/item.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class ItemRepository extends BaseRepository<IItem> implements IItemRepository {
  constructor() {
    super({
      collection: "logistic.item",
      db: "berp",
    });
  }
}

export const itemRepository = singleton(ItemRepository);

