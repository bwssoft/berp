import {
  IIdentification,
  IIdentificationRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class IdentificationRepository
  extends BaseRepository<IIdentification>
  implements IIdentificationRepository
{
  constructor() {
    super({
      collection: "production.identification",
      db: "berp",
    });
  }
}

export const identificationRepository = singleton(IdentificationRepository);
