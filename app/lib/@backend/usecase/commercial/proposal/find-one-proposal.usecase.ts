import { IProposal, IProposalRepository } from "@/app/lib/@backend/domain";
import { proposalRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;

class FindOneProposalUsecase {
  repository: IProposalRepository;

  constructor() {
    this.repository = proposalRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IProposal>) {
    return await this.repository.findOne(input);
  }
}

export const findOneProposalUsecase = singleton(FindOneProposalUsecase);
