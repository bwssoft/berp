import { IAccount } from "@/app/lib/@backend/domain/commercial/entity/account.definition";
import { IAccountRepository } from "@/app/lib/@backend/domain/commercial/repository/account.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { accountRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";

namespace Dto {
  export interface Input {
    filter?: Filter<IAccount>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IAccount>;
}

class FindManyAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
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

export const findManyAccountUsecase = singleton(FindManyAccountUsecase);
