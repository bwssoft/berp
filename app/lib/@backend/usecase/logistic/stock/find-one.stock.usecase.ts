import { Filter } from "mongodb";

import IStock from "@/backend/domain/logistic/entity/stock.entity"; // Assumindo que IStockRepository existe
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators"; // Assumindo que este decorator existe
import { stockRepository } from "@/backend/infra"; // Assumindo que stockRepository existe

namespace Dto {
  // Define a interface de entrada para o caso de uso
  export interface Input {
    filter?: Filter<IStock>; // Filtro opcional para a consulta, usando o tipo Filter do MongoDB
  }
  // Define o tipo de saída como um resultado paginado de IStock
  export type Output = IStock | null;
}

class FindOneStockUsecase {
  // Injeta a dependência do repositório
  repository: IStockRepository = stockRepository;

  // Aplica o decorator para remover _id, se necessário
  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Chama o método findOne do repositório, passando os argumentos de filtro, limite, página e ordenação.
    // Utiliza o operador de coalescência nula (??) para fornecer um filtro vazio caso nenhum seja passado.
    return await this.repository.findOne(arg.filter ?? {});
  }
}

// Exporta a instância singleton do caso de uso
export const findOneStockUsecase = singleton(FindOneStockUsecase);

