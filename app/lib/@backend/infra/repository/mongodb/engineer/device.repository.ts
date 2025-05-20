import { singleton } from "@/app/lib/util/singleton";
import { IDevice } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class DeviceRepository extends BaseRepository<IDevice> {
  constructor() {
    super({
      collection: "engineer.device",
      db: "berp",
    });
  }
}

export const deviceRepository = singleton(DeviceRepository);
