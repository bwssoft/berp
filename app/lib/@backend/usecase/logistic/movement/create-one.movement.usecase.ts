import { IMovement, IMovementRepository } from "@/app/lib/@backend/domain"; // Assumindo que IMovementRepository existe em domain
import { movementRepository } from "@/app/lib/@backend/infra"; // Assumindo que movementRepository existe em infra
import { singleton } from "@/app/lib/util/singleton";
import { randomUUID } from "crypto";
import { consolidateStockByMovementUseCase } from "../stock";

namespace Dto {
  // Input DTO: Omit 'id' and 'created_at' as they are generated
  export type Input = Omit<IMovement, "id" | "created_at">;

  // Output DTO: The created IMovement object
  export type Output = IMovement;
}

class CreateOneMovementUsecase {
  private repository: IMovementRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = movementRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    // Cria o objeto base com um novo ID e data de criação
    const base: IMovement = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    // Chama o método create do repositório
    await this.repository.create(base);

    await consolidateStockByMovementUseCase.execute([base]);

    // Retorna o objeto base criado
    return base;
  }
}

// Exporta a instância singleton do caso de uso
export const createOneMovementUsecase = singleton(CreateOneMovementUsecase);
