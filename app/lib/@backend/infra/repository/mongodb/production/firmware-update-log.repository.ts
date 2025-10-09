import type { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import type { IFirmwareUpdateLogRepository } from "@/backend/domain/production/repository/firmware-update-log.repository";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class FirmwareUpdateLogRepository
  extends BaseRepository<IFirmwareUpdateLog>
  implements IFirmwareUpdateLogRepository
{
  constructor() {
    super({
      collection: "production.firmware-update-log",
      db: "berp",
    });
  }
}

export const firmwareUpdateLogRepository = singleton(
  FirmwareUpdateLogRepository
);

