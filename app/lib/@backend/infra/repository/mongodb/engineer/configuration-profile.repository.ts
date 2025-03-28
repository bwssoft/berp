import { singleton } from "@/app/lib/util/singleton";
import { IConfigurationProfile } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class ConfigurationProfile extends BaseRepository<IConfigurationProfile> {
  constructor() {
    super({
      collection: "engineer-configuration-profile",
      db: "berp"
    });
  }
}

export const configurationProfileRepository = singleton(ConfigurationProfile)
