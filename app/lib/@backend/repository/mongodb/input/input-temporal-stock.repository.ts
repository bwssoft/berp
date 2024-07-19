import { singleton } from "@/app/lib/util/singleton";
import { IInputTemporalStock } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";

class InputTemporalStockRepository extends BaseRepository<IInputTemporalStock> {
  constructor() {
    super({
      collection: "input-temporal-stock",
      db: "bstock"
    });
  }
}

export const inputTemporalStockRepository = singleton(InputTemporalStockRepository)
