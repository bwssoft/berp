import { Filter } from "mongodb";

import { IItem, IItemRepository } from "@/app/lib/@backend/domain"; // Assumindo que IItemRepository existe
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators"; // Assumindo que este decorator existe
import { itemRepository } from "@/app/lib/@backend/infra"; // Assumindo que itemRepository existe

namespace Dto {
  // Define a interface de entrada para o caso de uso
  export interface Input {
    filter?: Filter<IItem>; // Filtro opcional para a consulta, usando o tipo Filter do MongoDB
  }
  // Define o tipo de saída como um resultado paginado de IItem
  export type Output = IItem | null;
}

class FindOneItemUsecase {
  // Injeta a dependência do repositório
  repository: IItemRepository = itemRepository;

  // Aplica o decorator para remover _id, se necessário
  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Chama o método findOne do repositório, passando os argumentos de filtro, limite, página e ordenação.
    // Utiliza o operador de coalescência nula (??) para fornecer um filtro vazio caso nenhum seja passado.
    return await this.repository.findOne(arg.filter ?? {});
  }
}

// Exporta a instância singleton do caso de uso
export const findOneItemUsecase = singleton(FindOneItemUsecase);
