import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IAutoTestLog } from "@/backend/domain/production/entity/auto-test-log.definition";
import type { IAutoTestLogRepository } from "@/backend/domain/production/repository/auto-test-log.repository";
import { autoTestLogRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IAutoTestLog> {}
  export type Output = IAutoTestLog[];
}

class FindManyAutoTestLogUsecase {
  repository: IAutoTestLogRepository;

  constructor() {
    this.repository = autoTestLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const { docs } = await this.repository.findMany(arg);
    return docs;
  }
}

export const findManyAutoTestLogUsecase = singleton(
  FindManyAutoTestLogUsecase
);
