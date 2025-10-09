import IFirmwareUpdateLog from "@/app/lib/@backend/domain/production/entity/firmware-update-log.definition";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
    const result = await this.repository.findOne(arg);
    return result;
  }
}

export const findOneFirmwareUpdateLogUsecase = singleton(
  FindOneFirmwareUpdateLogUsecase
);
