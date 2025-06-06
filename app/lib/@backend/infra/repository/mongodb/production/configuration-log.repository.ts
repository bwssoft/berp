import {
  IConfigurationLog,
  IConfigurationLogRepository,
} from "@/app/lib/@backend/domain";
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
