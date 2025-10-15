import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import type { IFirmwareUpdateLogRepository } from "@/backend/domain/production/repository/firmware-update-log.repository";
import { firmwareUpdateLogRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IFirmwareUpdateLog> {}
  export type Output = IFirmwareUpdateLog[];
}

class FindManyFirmwareUpdateLogUsecase {
  repository: IFirmwareUpdateLogRepository;

  constructor() {
    this.repository = firmwareUpdateLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const { docs } = await this.repository.findMany(arg, 200);
    return docs;
  }
}

export const findManyFirmwareUpdateLogUsecase = singleton(
  FindManyFirmwareUpdateLogUsecase
);
