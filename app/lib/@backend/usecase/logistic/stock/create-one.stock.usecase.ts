import { IStock, IStockRepository } from "@/app/lib/@backend/domain"; // Assumindo que IStockRepository existe em domain
import { stockRepository } from "@/app/lib/@backend/infra"; // Assumindo que stockRepository existe em infra
import { singleton } from "@/app/lib/util/singleton";
import { randomUUID } from "crypto";

namespace Dto {
  // Input DTO: Omit 'id' and 'created_at' as they are generated
  export type Input = Omit<IStock, "id" | "created_at">;

  // Output DTO: The created IStock object
  export type Output = IStock;
}

class CreateOneStockUsecase {
  private repository: IStockRepository;

  constructor() {
    // Injeta a dependência do repositório
    this.repository = stockRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    // Cria o objeto base com um novo ID e data de criação
    const base: IStock = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    // Chama o método create do repositório
    await this.repository.create(base);

    // Retorna o objeto base criado
    return base;
  }
}

// Exporta a instância singleton do caso de uso
export const createOneStockUsecase = singleton(CreateOneStockUsecase);
