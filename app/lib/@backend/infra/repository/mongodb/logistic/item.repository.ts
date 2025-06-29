import { IItemRepository, IItem } from "@/app/lib/@backend/domain";
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
