import {
  IFirmwareUpdateLog,
  IFirmwareUpdateLogRepository,
} from "@/app/lib/@backend/domain";
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
