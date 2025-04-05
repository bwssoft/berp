import {
  IIdentificationLog,
  IIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
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
    const result = await this.repository.findAll(arg);
    return result;
  }
}

export const findManyIdentificationLogUsecase = singleton(
  FindManyIdentificationLogUsecase
);
