import { IStock } from "@/app/lib/@backend/domain/logistic/entity/stock.entity";
import { IStockRepository } from "@/app/lib/@backend/domain/logistic/repository/stock.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class StockRepository
  extends BaseRepository<IStock>
  implements IStockRepository
{
  constructor() {
    super({
      collection: "logistic.stock",
      db: "berp",
    });
  }
}

export const stockRepository = singleton(StockRepository);
