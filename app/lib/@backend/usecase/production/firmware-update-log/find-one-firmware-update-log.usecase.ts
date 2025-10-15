import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import type { IFirmwareUpdateLogRepository } from "@/backend/domain/production/repository/firmware-update-log.repository";
import { firmwareUpdateLogRepository } from "@/backend/infra";

namespace Dto {
  export interface Input extends Partial<IFirmwareUpdateLog> {}
  export type Output = IFirmwareUpdateLog | null;
}

class FindOneFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg);
  }
}

export const findOneFirmwareUpdateLogUsecase = singleton(
  FindOneFirmwareUpdateLogUsecase
);
