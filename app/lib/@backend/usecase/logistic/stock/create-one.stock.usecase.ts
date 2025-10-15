import { singleton } from "@/app/lib/util/singleton";
import type { IStock } from "@/backend/domain/logistic/entity/stock.entity";
import type { IStockRepository } from "@/backend/domain/logistic/repository/stock.repository";
import { stockRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

namespace Dto {
  export type Input = Omit<IStock, "id" | "created_at">;
  export type Output = IStock;
}

class CreateOneStockUsecase {
  private repository: IStockRepository;

  constructor() {
    this.repository = stockRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const stock: IStock = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(stock);

    return stock;
  }
}

export const createOneStockUsecase = singleton(CreateOneStockUsecase);
