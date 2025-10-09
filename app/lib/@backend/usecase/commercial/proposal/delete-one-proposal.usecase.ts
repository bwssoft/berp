import { singleton } from "@/app/lib/util/singleton"
import { IProposal } from "@/app/lib/@backend/domain/commercial/entity/proposal.definition";
import { IProposalRepository } from "@/app/lib/@backend/domain/commercial/repository/proposal.repository";
import { proposalRepository } from "@/app/lib/@backend/infra"

class DeleteOneProposalUsecase {
  repository: IProposalRepository

  constructor() {
    this.repository = proposalRepository
  }

  async execute(input: Partial<IProposal>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneProposalUsecase = singleton(DeleteOneProposalUsecase)
