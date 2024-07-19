import { singleton } from "@/app/lib/util/singleton";
import { IInputStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class InputStockRepository extends BaseRepository<IInputStock> {
  constructor() {
    super({
      collection: "input-stock",
      db: "bstock"
    });
  }
}

export const inputStockRepository = singleton(InputStockRepository)
