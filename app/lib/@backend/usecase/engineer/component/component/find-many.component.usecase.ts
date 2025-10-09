import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { componentRepository } from "@/app/lib/@backend/infra";
import { IComponent } from "@/app/lib/@backend/domain/engineer/entity/component.definition";
import { IComponentRepository } from "@/app/lib/@backend/domain/engineer/repository/component.repository.interface";
import { RemoveFields } from "@/app/lib/@backend/decorators";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

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
