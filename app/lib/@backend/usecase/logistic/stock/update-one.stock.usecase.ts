import { singleton } from "@/app/lib/util/singleton";
import type { IStock } from "@/backend/domain/logistic/entity/stock.entity";
import type { IStockRepository } from "@/backend/domain/logistic/repository/stock.repository";
import { stockRepository } from "@/backend/infra";

class UpdateOneStockUsecase {
  repository: IStockRepository;

  constructor() {
    this.repository = stockRepository;
  }

  async execute(query: { id: string }, value: Omit<IStock, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneStockUsecase = singleton(UpdateOneStockUsecase);
