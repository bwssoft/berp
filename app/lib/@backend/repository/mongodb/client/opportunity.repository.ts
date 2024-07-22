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

  async findAllWithClient() {
    const db = await this.connect();
    return await db.collection<IOpportunity>(this.collection).aggregate([
      { $match: {} },
      {
        $lookup: {
          as: "client",
          from: "client",
          localField: "client_id",
          foreignField: "id"
        }
      },
      {
        $project: {
          id: 1,
          name: 1,
          type: 1,
          sales_stage: 1,
          created_at: 1,
          client: { $first: "$client" },
        }
      },
    ]).toArray() as (IOpportunity & { client: IClient })[]
  }
}

export const opportunityRepository = singleton(OpportunityRepository)
