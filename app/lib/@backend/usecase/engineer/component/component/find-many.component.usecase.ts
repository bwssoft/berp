import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { componentRepository } from "@/backend/infra";
import { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import { IComponentRepository } from "@/backend/domain/engineer/repository/component.repository";
import { RemoveFields } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IComponent>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IComponent>;
}
class FindManyComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  @RemoveFields("_id")
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
    );
  }
}

export const findManyComponentUsecase = singleton(FindManyComponentUsecase);

