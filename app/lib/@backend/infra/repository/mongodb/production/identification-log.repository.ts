import IIdentificationLog from "@/app/lib/@backend/domain/production/entity/identification-log.definition";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class IdentificationLogRepository
  extends BaseRepository<IIdentificationLog>
  implements IIdentificationLogRepository
{
  constructor() {
    super({
      collection: "production.identification-log",
      db: "berp",
    });
  }
}

export const identificationLogRepository = singleton(
  IdentificationLogRepository
);
