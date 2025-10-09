import { singleton } from "@/app/lib/util/singleton";
import IStock from "@/backend/domain/logistic/entity/stock.entity"; // Assumindo que IStockRepository existe em domain
import { stockRepository } from "@/backend/infra"; // Assumindo que stockRepository existe em infra

class UpdateOneStockUsecase {
  repository: IStockRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = stockRepository;
  }

  // O método execute recebe um query para identificar o documento e o valor a ser atualizado.
  // O valor omite 'id' e 'created_at' pois estes geralmente não são atualizáveis diretamente.
  async execute(
    query: { id: string },
    value: Omit<IStock, "id" | "created_at">
  ) {
    // Chama o método updateOne do repositório, utilizando $set para aplicar as atualizações.
    return await this.repository.updateOne(query, { $set: value });
  }
}

// Exporta a instância singleton do caso de uso
export const updateOneStockUsecase = singleton(UpdateOneStockUsecase);

