import { singleton } from "@/app/lib/util/singleton";
import type { Filter } from "mongodb";
import { inputRepository } from "@/app/lib/@backend/infra";
import { IInput, IInputRepository } from "@/app/lib/@backend/domain";
import { RemoveFields } from "@/app/lib/@backend/decorators";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IInput>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IInput>;
}
class FindManyInputUsecase {
  repository: IInputRepository;

  constructor() {
    this.repository = inputRepository;
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

export const findManyInputUsecase = singleton(FindManyInputUsecase);
