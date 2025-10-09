import { Filter } from "mongodb";

import IBase from "@/app/lib/@backend/domain/logistic/entity/base.entity"; // Assumindo que ILogisticBaseRepository existe
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators"; // Assumindo que este decorator existe
import { baseRepository } from "@/app/lib/@backend/infra"; // Assumindo que baseRepository existe
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface"; // Assumindo que PaginationResult existe

namespace Dto {
  // Define a interface de entrada para o caso de uso
  export interface Input {
    filter?: Filter<IBase>; // Filtro opcional para a consulta, usando o tipo Filter do MongoDB
    page?: number; // Número da página opcional para paginação
    limit?: number; // Limite de itens por página opcional
    sort?: Record<string, 1 | -1>; // Objeto opcional para ordenação
  }
  // Define o tipo de saída como um resultado paginado de IBase
  export type Output = PaginationResult<IBase>;
}

class FindManyBaseUsecase {
  // Injeta a dependência do repositório
  repository: ILogisticBaseRepository = baseRepository;

  // Aplica o decorator para remover _id, se necessário
  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    // Chama o método findMany do repositório, passando os argumentos de filtro, limite, página e ordenação.
    // Utiliza o operador de coalescência nula (??) para fornecer um filtro vazio caso nenhum seja passado.
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
    );
  }
}

// Exporta a instância singleton do caso de uso
export const findManyBaseUsecase = singleton(FindManyBaseUsecase);
