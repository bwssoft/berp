import IIdentificationLog from "@/app/lib/@backend/domain/production/entity/identification-log.definition";
import { identificationLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

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
