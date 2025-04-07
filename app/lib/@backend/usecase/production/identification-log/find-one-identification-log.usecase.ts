import {
  IIdentificationLog,
  IIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import { identificationLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export interface Input extends Partial<IIdentificationLog> {}

  export type Output = IIdentificationLog | null;
}

class FindOneIdentificationLogUsecase {
  repository: IIdentificationLogRepository;

  constructor() {
    this.repository = identificationLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const result = await this.repository.findOne(arg);
    return result;
  }
}

export const findOneIdentificationLogUsecase = singleton(
  FindOneIdentificationLogUsecase
);
