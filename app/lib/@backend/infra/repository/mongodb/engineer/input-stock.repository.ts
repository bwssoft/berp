import { singleton } from "@/app/lib/util/singleton";
import { IInputStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class InputStockRepository extends BaseRepository<IInputStock> {
  constructor() {
    super({
      collection: "input-stock",
      db: "berp"
    });
  }
}

export const inputStockRepository = singleton(InputStockRepository)
