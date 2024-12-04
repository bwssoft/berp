import { IClient, IProposal, IProposalRepository } from "@/app/lib/@backend/domain";
import { proposalRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllProposalWithClientUsecase {
  repository: IProposalRepository;

  constructor() {
    this.repository = proposalRepository;
  }

  @RemoveMongoId()
  async execute() {
    const pipeline = this.pipeline();
    const aggragate = await this.repository.aggregate(pipeline);
    return (await aggragate.toArray()) as (IProposal & {
      client: IClient;
    })[];
  }
  pipeline() {
    return [
      { $match: {} },
      { $limit: 20 },
      {
        $lookup: {
          as: "client",
          from: "client",
          localField: "client_id",
          foreignField: "id",
          pipeline: [{
            $project: { _id: 0 }
          }]
        },
      },
      {
        $project: {
          client: { $first: "$client" },
          created_at: 1,
          id: 1,
          phase: 1
        }
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
  }
}

export const findAllProposalWithClientUsecase = singleton(FindAllProposalWithClientUsecase);
