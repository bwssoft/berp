import { Filter } from "mongodb";

import { IMovement, IMovementRepository } from "@/app/lib/@backend/domain"; // Assumindo que IMovementRepository existe
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators"; // Assumindo que este decorator existe
import { movementRepository } from "@/app/lib/@backend/infra"; // Assumindo que movementRepository existe

namespace Dto {
  // Define a interface de entrada para o caso de uso
  export interface Input {
    filter?: Filter<IMovement>; // Filtro opcional para a consulta, usando o tipo Filter do MongoDB
  }
  // Define o tipo de saída como um resultado paginado de IMovement
  export type Output = IMovement | null;
}

class FindOneMovementUsecase {
  // Injeta a dependência do repositório
  repository: IMovementRepository = movementRepository;

  // Aplica o decorator para remover _id, se necessário
  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Chama o método findOne do repositório, passando os argumentos de filtro, limite, página e ordenação.
    // Utiliza o operador de coalescência nula (??) para fornecer um filtro vazio caso nenhum seja passado.
    return await this.repository.findOne(arg.filter ?? {});
  }
}

// Exporta a instância singleton do caso de uso
export const findOneMovementUsecase = singleton(FindOneMovementUsecase);
