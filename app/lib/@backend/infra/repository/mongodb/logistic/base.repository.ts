import type { ILogisticBaseRepository } from "@/backend/domain/logistic/repository/base.repository.interface";
import type { IBase } from "@/backend/domain/logistic/entity/base.entity";
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

