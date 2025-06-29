import { ILogisticBaseRepository, IBase } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class LogisticBaseRepository
  extends BaseRepository<IBase>
  implements ILogisticBaseRepository
{
  constructor() {
    super({
      collection: "logistic.base",
      db: "berp",
    });
  }
}

export const baseRepository = singleton(LogisticBaseRepository);
