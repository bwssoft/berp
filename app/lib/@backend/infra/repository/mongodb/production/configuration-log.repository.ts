import IConfigurationLog from "@/app/lib/@backend/domain/production/entity/configuration-log.definition";
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
