import { IControl } from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { IControlRepository } from "@/app/lib/@backend/domain/admin/repository/control.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { controlRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "../../../domain/@shared/repository/pagination.interface";

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
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort
  );
  }
}

export const findManyControlUsecase = singleton(FindManyControlUsecase);
