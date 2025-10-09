import IAutoTestLog from "@/backend/domain/production/entity/auto-test-log.definition";
import { autoTestLogRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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
    const result = await this.repository.findOne(arg);
    return result;
  }
}

export const findOneAutoTestLogUsecase = singleton(FindOneAutoTestLogUsecase);

