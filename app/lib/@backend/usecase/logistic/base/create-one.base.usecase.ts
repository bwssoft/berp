import IBase from "@/app/lib/@backend/domain/logistic/entity/base.entity"; // Assumindo que IBaseRepository existe em domain
import { baseRepository } from "@/app/lib/@backend/infra"; // Assumindo que baseRepository existe em infra
import { singleton } from "@/app/lib/util/singleton";
import { randomUUID } from "crypto";

namespace Dto {
  // Input DTO: Omit 'id' and 'created_at' as they are generated
  export type Input = Omit<IBase, "id" | "created_at">;

  // Output DTO: The created IBase object
  export type Output = { success: boolean; error?: { global: string } };
}

class CreateOneBaseUsecase {
  private repository: ILogisticBaseRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = baseRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      // Cria o objeto base com um novo ID e data de criação
      const base: IBase = {
        ...input,
        id: randomUUID(),
        created_at: new Date(),
      };

      // Chama o método create do repositório
      await this.repository.create(base);
      return { success: true };
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
export const createOneBaseUsecase = singleton(CreateOneBaseUsecase);
