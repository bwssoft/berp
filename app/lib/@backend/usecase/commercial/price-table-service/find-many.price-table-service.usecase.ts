import { Filter } from "mongodb";
import { IPriceTableService } from "@/app/lib/@backend/domain/commercial/entity/price-table-service.definition";
import { priceTableServiceRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/price-table-service.repository";

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
