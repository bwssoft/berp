import { singleton } from "@/app/lib/util/singleton";
import { IBase, ILogisticBaseRepository } from "@/app/lib/@backend/domain"; // Assumindo que ILogisticBaseRepository existe em domain
import { baseRepository } from "@/app/lib/@backend/infra"; // Assumindo que baseRepository existe em infra

class UpdateOneBaseUsecase {
  repository: ILogisticBaseRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = baseRepository;
  }

  // O método execute recebe um query para identificar o documento e o valor a ser atualizado.
  // O valor omite 'id' e 'created_at' pois estes geralmente não são atualizáveis diretamente.
  async execute(
    query: { id: string },
    value: Omit<IBase, "id" | "created_at">
  ) {
    // Chama o método updateOne do repositório, utilizando $set para aplicar as atualizações.
    try {
      await this.repository.updateOne(query, { $set: value });
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

// Exporta a instância singleton do caso de uso
export const updateOneBaseUsecase = singleton(UpdateOneBaseUsecase);
