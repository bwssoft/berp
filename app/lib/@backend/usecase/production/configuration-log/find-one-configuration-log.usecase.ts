import IConfigurationLog from "@/backend/domain/production/entity/configuration-log.definition";
import { configurationLogRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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
    const result = await this.repository.findOne(arg);
    return result;
  }
}

export const findOneConfigurationLogUsecase = singleton(
  FindOneConfigurationLogUsecase
);

