import type { IAutoTestLog } from "@/backend/domain/production/entity/auto-test-log.definition";
import type { IAutoTestLogRepository } from "@/backend/domain/production/repository/auto-test-log.repository";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class AutoTestLogRepository
  extends BaseRepository<IAutoTestLog>
  implements IAutoTestLogRepository
{
  constructor() {
    super({
      collection: "production.auto-test-log",
      db: "berp",
    });
  }
}

export const autoTestLogRepository = singleton(AutoTestLogRepository);


