import IAutoTestLogRepository from "@/app/lib/@backend/domain/production/repository/auto-test-log.repository.interface";
import IAutoTestLog from "@/app/lib/@backend/domain/production/entity/auto-test-log.definition";
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
