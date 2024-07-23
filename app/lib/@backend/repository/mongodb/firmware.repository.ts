import { singleton } from "@/app/lib/util/singleton";
import { IFirmware } from "@/app/lib/@backend/domain";
import { BaseRepository } from "./@base/base";

class FirmwareRepository extends BaseRepository<IFirmware> {
  constructor() {
    super({
      collection: "firmware",
      db: "berp"
    });
  }
}

export const firmwareRepository = singleton(FirmwareRepository)
