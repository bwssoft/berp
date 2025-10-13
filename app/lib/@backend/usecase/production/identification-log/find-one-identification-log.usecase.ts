import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IIdentificationLog } from "@/backend/domain/production/entity/identification-log.definition";
import type { IIdentificationLogRepository } from "@/backend/domain/production/repository/identification-log.repository";
import { identificationLogRepository } from "@/backend/infra";

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
    return await this.repository.findOne(arg);
  }
}

export const findOneIdentificationLogUsecase = singleton(
  FindOneIdentificationLogUsecase
);
