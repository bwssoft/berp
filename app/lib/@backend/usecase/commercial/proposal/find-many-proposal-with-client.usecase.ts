import { IClient } from "@/backend/domain/commercial/entity/client.definition";
import { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";
import { IProposalRepository } from "@/backend/domain/commercial/repository/proposal.repository";
import { proposalRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";;

namespace Dto {
  export interface Input extends Partial<IProposal> { }
  export type Document = IProposal & { client: IClient }
  export type Output = (IProposal & { client: IClient })[]
}
class FindManyProposalWithClientUsecase {
  repository: IProposalRepository;

  constructor() {
    this.repository = proposalRepository;
  }

  @RemoveMongoId()
  async execute(input: Dto.Input): Promise<Dto.Output> {
    const aggragate = await this.repository.aggregate<Dto.Document>(this.pipeline());
    return await aggragate.toArray()
  }
  pipeline() {
    return [
      { $match: {} },
      { $limit: 20 },
      {
        $lookup: {
          as: "client",
          from: "commercial-client",
          localField: "client_id",
          foreignField: "id",
          pipeline: [{
            $project: { _id: 0 }
          }]
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $project: {
          client: { $first: "$client" },
          created_at: 1,
          id: 1,
          code: 1
        }
      },
    ];
  }
}

export const findManyProposalWithClientUsecase = singleton(FindManyProposalWithClientUsecase);

