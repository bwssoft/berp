import {
  IClient,
  IOpportunity,
  IOpportunityRepository,
} from "@/app/lib/@backend/domain";
import { opportunityRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllOpportunityWithClientUsecase {
  repository: IOpportunityRepository;

  constructor() {
    this.repository = opportunityRepository;
  }

  @RemoveMongoId()
  async execute() {
    const pipeline = this.pipeline();
    const aggragate = await this.repository.aggregate(pipeline);
    return (await aggragate.toArray()) as (IOpportunity & {
      client: IClient;
    })[];
  }
  pipeline() {
    return [
      { $match: {} },
      {
        $lookup: {
          as: "client",
          from: "client",
          localField: "client_id",
          foreignField: "id",
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          type: 1,
          sales_stage: 1,
          created_at: 1,
          client: { $first: "$client" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
  }
}

export const findAllOpportunityWithClientUsecase = singleton(
  FindAllOpportunityWithClientUsecase
);
