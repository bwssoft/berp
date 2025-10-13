import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IIdentificationLog } from "@/backend/domain/production/entity/identification-log.definition";
import type { IIdentificationLogRepository } from "@/backend/domain/production/repository/identification-log.repository";
import { identificationLogRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IIdentificationLog> {}
  export type Output = IIdentificationLog[];
}

class FindManyIdentificationLogUsecase {
  repository: IIdentificationLogRepository;

  constructor() {
    this.repository = identificationLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const { docs } = await this.repository.findMany(arg);
    return docs;
  }
}

export const findManyIdentificationLogUsecase = singleton(
  FindManyIdentificationLogUsecase
);
