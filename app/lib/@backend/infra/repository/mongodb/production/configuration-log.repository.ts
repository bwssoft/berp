import type { IConfigurationLog } from "@/backend/domain/production/entity/configuration-log.definition";
import type { IConfigurationLogRepository } from "@/backend/domain/production/repository/configuration-log.repository";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class ConfigurationLogRepository
  extends BaseRepository<IConfigurationLog>
  implements IConfigurationLogRepository
{
  constructor() {
    super({
      collection: "production.configuration-log",
      db: "berp",
    });
  }
}

export const configurationLogRepository = singleton(ConfigurationLogRepository);

