import type { Filter } from "mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { enterpriseRepository } from "@/backend/infra";
import type { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IEnterprise } from "@/backend/domain/business/entity/enterprise.entity";
import type { IEnterpriseRepository } from "@/backend/domain/business/repositoty/enterprise.repository";

namespace Dto {
  export interface Input {
    filter?: Filter<IEnterprise>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }

  export type Output = PaginationResult<IEnterprise>;
}

class FindManyEnterpriseUsecase {
  repository: IEnterpriseRepository = enterpriseRepository;

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

export const findManyEnterpriseUsecase = singleton(FindManyEnterpriseUsecase);
