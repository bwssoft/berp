
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IBase } from "@/backend/domain/logistic/entity/base.entity";
import type { ILogisticBaseRepository } from "@/backend/domain/logistic/repository/base.repository";
import { baseRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IBase>;
  }
  export type Output = IBase | null;
}

class FindOneBaseUsecase {
  repository: ILogisticBaseRepository = baseRepository;

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg.filter ?? {});
  }
}

export const findOneBaseUsecase = singleton(FindOneBaseUsecase);
