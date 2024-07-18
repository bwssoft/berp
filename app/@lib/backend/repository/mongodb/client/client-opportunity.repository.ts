import { IClientOpportunity } from "@/app/@lib/backend/domain";
import { BaseRepository } from "../@base/base";

class ClientOpportunityRepository extends BaseRepository<IClientOpportunity> {
  private static instance: ClientOpportunityRepository;

  private constructor() {
    super({
      collection: "client-opportunity",
      db: "bstock"
    });
  }

  public static getInstance(): ClientOpportunityRepository {
    if (!ClientOpportunityRepository.instance) {
      ClientOpportunityRepository.instance = new ClientOpportunityRepository();
    }
    return ClientOpportunityRepository.instance;
  }

  async findAllWithClient() {
    const db = await this.connect();
    return await db.collection<IClientOpportunity>(this.collection).aggregate([
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
    ]).toArray();
  }
}

export const clientOpportunityRepository = ClientOpportunityRepository.getInstance();
