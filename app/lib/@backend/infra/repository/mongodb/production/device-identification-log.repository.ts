import {
  IDeviceIdentificationLog,
  IDeviceIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class DeviceIdentificationLogRepository
  extends BaseRepository<IDeviceIdentificationLog>
  implements IDeviceIdentificationLogRepository
{
  constructor() {
    super({
      collection: "production.device-identification-log",
      db: "berp",
    });
  }
}

export const deviceIdentificationLogRepository = singleton(
  DeviceIdentificationLogRepository
);
