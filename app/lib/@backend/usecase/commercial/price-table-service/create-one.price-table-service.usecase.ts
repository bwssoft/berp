import { IPriceTableService } from "@/app/lib/@backend/domain/commercial/entity/price-table-service.definition";
import { priceTableServiceRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/price-table-service.repository";

class CreateOnePriceTableServiceUsecase {
  async execute(
    input: Omit<IPriceTableService, "id" | "created_at" | "updated_at">
  ) {
    try {
      // Add timestamps and ID
      const priceTableServiceData: IPriceTableService = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await priceTableServiceRepository.create(
        priceTableServiceData
      );

      if (!result) {
        return {
          success: false,
          error: "Falha ao criar serviço de tabela de preços",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error creating price table service:", error);
      return {
        success: false,
        error: "Falha ao criar serviço de tabela de preços",
      };
    }
  }
}

export const createOnePriceTableServiceUsecase =
  new CreateOnePriceTableServiceUsecase();
