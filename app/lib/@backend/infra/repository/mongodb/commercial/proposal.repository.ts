import { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class ProposalRepository extends BaseRepository<IProposal> {
  constructor() {
    super({
      collection: "commercial-proposal",
      db: "berp"
    });
  }

}

export const proposalRepository = singleton(ProposalRepository)

