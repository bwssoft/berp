import { IEnterprise } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class EnterpriseRepository extends BaseRepository<IEnterprise> {
  constructor() {
    super({
      collection: "business.enterprise",
      db: "berp",
    });
  }
}

export const enterpriseRepository = singleton(EnterpriseRepository);
