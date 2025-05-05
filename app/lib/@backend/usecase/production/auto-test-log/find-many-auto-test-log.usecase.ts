import {
  IAutoTestLog,
  IAutoTestLogRepository,
} from "@/app/lib/@backend/domain";
import { autoTestLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

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

export const findManyAutoTestLogUsecase = singleton(FindManyAutoTestLogUsecase);
