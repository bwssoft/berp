import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { configurationLogRepository } from "@/backend/infra";

namespace Dto {
  export interface Input extends Partial<IConfigurationLog> {}
  export type Output = IConfigurationLog | null;
}

class FindOneConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg);
  }
}

export const findOneConfigurationLogUsecase = singleton(
  FindOneConfigurationLogUsecase
);
