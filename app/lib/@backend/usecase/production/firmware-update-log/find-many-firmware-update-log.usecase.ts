import {
  IFirmwareUpdateLog,
  IFirmwareUpdateLogRepository,
} from "@/app/lib/@backend/domain";
import { firmwareUpdateLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { Filter } from "mongodb";

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
