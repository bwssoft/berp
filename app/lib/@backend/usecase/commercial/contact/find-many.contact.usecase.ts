import { IContact, IContactRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { contactRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IContact>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IContact>;
}

class FindManyContactUsecase {
  repository: IContactRepository;

  constructor() {
    this.repository = contactRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findMany(
      arg.filter ?? {},
      arg.limit,
      arg.page,
      arg.sort ?? { name: 1 }
    );
  }
}

export const findManyContactUsecase = singleton(FindManyContactUsecase);
