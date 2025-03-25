import { IProfile } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class ProfileRepository extends BaseRepository<IProfile> {
  constructor() {
    super({
      collection: "admin.profile",
      db: "berp",
    });
  }
}

export const profileRepository = singleton(ProfileRepository);
