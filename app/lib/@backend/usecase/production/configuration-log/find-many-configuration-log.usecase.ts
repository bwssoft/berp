import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { configurationLogRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IConfigurationLog> {}
  export type Output = IConfigurationLog[];
}

class FindManyConfigurationLogUsecase {
  repository: IConfigurationLogRepository;

  constructor() {
    this.repository = configurationLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const { docs } = await this.repository.findMany(arg, 200);
    return docs;
  }
}

export const findManyConfigurationLogUsecase = singleton(
  FindManyConfigurationLogUsecase
);
