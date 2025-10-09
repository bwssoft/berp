import { singleton } from "@/app/lib/util/singleton"
import { IProposal } from "@/app/lib/@backend/domain/commercial/entity/proposal.definition";
import { IProposalRepository } from "@/app/lib/@backend/domain/commercial/repository/proposal.repository";
import { proposalRepository } from "@/app/lib/@backend/infra"

class UpdateOneProposalUsecase {
  repository: IProposalRepository

  constructor() {
    this.repository = proposalRepository
  }

  async execute(query: { id: string }, value: Omit<IProposal, "id" | "created_at" | "user_id" | "code">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneProposalUsecase = singleton(UpdateOneProposalUsecase)
