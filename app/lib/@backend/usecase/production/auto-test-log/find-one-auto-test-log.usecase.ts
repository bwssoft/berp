import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IAutoTestLog } from "@/backend/domain/production/entity/auto-test-log.definition";
import type { IAutoTestLogRepository } from "@/backend/domain/production/repository/auto-test-log.repository";
import { autoTestLogRepository } from "@/backend/infra";

namespace Dto {
  export interface Input extends Partial<IAutoTestLog> {}
  export type Output = IAutoTestLog | null;
}

class FindOneAutoTestLogUsecase {
  repository: IAutoTestLogRepository;

  constructor() {
    this.repository = autoTestLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg);
  }
}

export const findOneAutoTestLogUsecase = singleton(FindOneAutoTestLogUsecase);
