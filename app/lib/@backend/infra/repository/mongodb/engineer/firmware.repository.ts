import { singleton } from "@/app/lib/util/singleton";
import { IFirmware } from "@/app/lib/@backend/domain/engineer/entity/firmware.definition";
import { BaseRepository } from "../@base";

class FirmwareRepository extends BaseRepository<IFirmware> {
  constructor() {
    super({
      collection: "firmware",
      db: "berp"
    });
  }

  async findOneByName(name: string) {
    const db = await this.connect();
    return await db.collection(this.collection).findOne<IFirmware>({ name });
  }
}

export const firmwareRepository = singleton(FirmwareRepository)
