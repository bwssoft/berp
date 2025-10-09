import IItem from "@/app/lib/@backend/domain/logistic/entity/item.entity"; // Assumindo que IItemRepository existe em domain
import { itemRepository } from "@/app/lib/@backend/infra"; // Assumindo que itemRepository existe em infra
import { singleton } from "@/app/lib/util/singleton";
import { randomUUID } from "crypto";

namespace Dto {
  // Input DTO: Omit 'id' and 'created_at' as they are generated
  export type Input = Omit<IItem, "id" | "created_at">;

  // Output DTO: The created IItem object
  export type Output = { success: boolean; error?: { usecase: string } };
}

class CreateOneItemUsecase {
  private repository: IItemRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = itemRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    // Cria o objeto base com um novo ID e data de criação
    try {
      const base: IItem = {
        ...input,
        id: randomUUID(),
        created_at: new Date(),
      };

      // Chama o método create do repositório
      await this.repository.create(base);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          usecase: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

// Exporta a instância singleton do caso de uso
export const createOneItemUsecase = singleton(CreateOneItemUsecase);
