import { singleton } from "@/app/lib/util/singleton";
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { BaseRepository } from "../@base";

class FirmwareRepository extends BaseRepository<IFirmware> {
  constructor() {
    super({
      collection: "firmware",
      db: "berp"
    });
  }

  async findOneByName(name: string) {
    return this.findOne({ name } as Partial<IFirmware>);
  }
}

export const firmwareRepository = singleton(FirmwareRepository)

