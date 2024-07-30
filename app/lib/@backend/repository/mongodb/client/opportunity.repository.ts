import { IClient, IOpportunity } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";
import { singleton } from "@/app/lib/util/singleton";

class OpportunityRepository extends BaseRepository<IOpportunity> {
  constructor() {
    super({
      collection: "client-opportunity",
      db: "berp"
    });
  }

}

export const opportunityRepository = singleton(OpportunityRepository)
