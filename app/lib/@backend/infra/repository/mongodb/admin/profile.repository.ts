import { IProfile } from "@/backend/domain/admin/entity/profile.definition";
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

