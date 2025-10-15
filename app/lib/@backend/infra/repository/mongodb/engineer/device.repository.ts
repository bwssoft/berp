import { singleton } from "@/app/lib/util/singleton";
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
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

