import { singleton } from "@/app/lib/util/singleton";
import IMovement from "@/backend/domain/logistic/entity/movement.entity"; // Assumindo que IMovementRepository existe em domain
import { movementRepository } from "@/backend/infra"; // Assumindo que movementRepository existe em infra

class UpdateOneMovementUsecase {
  repository: IMovementRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = movementRepository;
  }

  // O método execute recebe um query para identificar o documento e o valor a ser atualizado.
  // O valor omite 'id' e 'created_at' pois estes geralmente não são atualizáveis diretamente.
  async execute(
    query: { id: string },
    value: Omit<IMovement, "id" | "created_at">
  ) {
    // Chama o método updateOne do repositório, utilizando $set para aplicar as atualizações.
    return await this.repository.updateOne(query, { $set: value });
  }
}

// Exporta a instância singleton do caso de uso
export const updateOneMovementUsecase = singleton(UpdateOneMovementUsecase);

