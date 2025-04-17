import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
import { configurationLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

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
    const result = await this.repository.findMany(arg);
    return result;
  }
}

export const findManyConfigurationLogUsecase = singleton(
  FindManyConfigurationLogUsecase
);
