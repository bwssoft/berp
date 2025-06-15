import { ISerial, ISerialRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";
import { bSerialClientPromise } from "../@base/b-serial";

class SerialRepository
  extends BaseRepository<ISerial>
  implements ISerialRepository
{
  constructor() {
    super({
      collection: "serial",
      db: "b-serial",
      client: bSerialClientPromise,
    });
  }
}

export const serialRepository = singleton(SerialRepository);
