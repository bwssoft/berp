import { ISerial } from "@/backend/domain/engineer/entity/serial.definition";
import { ISerialRepository } from "@/backend/domain/engineer/repository/serial.repository";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class SerialRepository
  extends BaseRepository<ISerial>
  implements ISerialRepository
{
  constructor() {
    super({
      collection: "serial",
      db: "b-serial",
    });
  }
}

export const serialRepository = singleton(SerialRepository);

