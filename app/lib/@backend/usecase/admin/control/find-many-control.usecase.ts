import type { IControl } from "@/backend/domain/admin/entity/control.definition";
import type { IControlRepository } from "@/backend/domain/admin/repository/control.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { controlRepository } from "@/backend/infra";
import type { Filter } from "mongodb";
import type { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
    export interface Input {
        filter?: Filter<IControl>;
        page?: number;
        limit?: number;
        sort?: Record<string, 1 | -1>;
    }
  export type Output = PaginationResult<IControl>;
}

class FindManyControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
    );
  }
}

export const findManyControlUsecase = singleton(FindManyControlUsecase);

