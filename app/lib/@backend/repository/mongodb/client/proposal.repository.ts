import { IProposal } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base/base";
import { singleton } from "@/app/lib/util/singleton";

class ProposalRepository extends BaseRepository<IProposal> {
  constructor() {
    super({
      collection: "client-proposal",
      db: "berp"
    });
  }

}

export const proposalRepository = singleton(ProposalRepository)
