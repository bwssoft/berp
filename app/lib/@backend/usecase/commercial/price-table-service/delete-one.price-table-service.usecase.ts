import { priceTableServiceRepository } from "@/app/lib/@backend/infra/repository/mongodb/commercial/price-table-service.repository";

class DeleteOnePriceTableServiceUsecase {
  async execute(id: string) {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID é obrigatório para exclusão",
        };
      }

      const result = await priceTableServiceRepository.deleteOne({ id });

      if (!result) {
        return {
          success: false,
          error: "Falha ao excluir serviço de tabela de preços",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error deleting price table service:", error);
      return {
        success: false,
        error: "Falha ao excluir serviço de tabela de preços",
      };
    }
  }
}

export const deleteOnePriceTableServiceUsecase =
  new DeleteOnePriceTableServiceUsecase();
