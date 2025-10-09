import { IItem } from "@/app/lib/@backend/domain/logistic/entity/item.entity";
import { IItemRepository } from "@/app/lib/@backend/domain/logistic/repository/item.repository.interface";
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
