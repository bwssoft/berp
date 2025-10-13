import type { Filter } from "mongodb";

import type { IPriceTableService } from "@/backend/domain/commercial/entity/price-table-service.definition";
import { priceTableServiceRepository } from "@/backend/infra";

interface Input {
  filter?: Filter<IPriceTableService>;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

class FindManyPriceTableServiceUsecase {
  async execute(input: Input) {
    const { filter = {}, page, limit, sort } = input;

    try {
      const result = await priceTableServiceRepository.findMany(
        filter,
        page,
        limit,
        sort
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error finding price table services:", error);
      return {
        success: false,
        error: "Falha ao buscar serviços de tabela de preços",
      };
    }
  }
}

export const findManyPriceTableServiceUsecase =
  new FindManyPriceTableServiceUsecase();

