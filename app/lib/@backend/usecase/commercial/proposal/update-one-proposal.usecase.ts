import { singleton } from "@/app/lib/util/singleton"
import { IProposal } from "@/backend/domain/commercial/entity/proposal.definition";
import { IProposalRepository } from "@/backend/domain/commercial/repository/proposal.repository";
import { proposalRepository } from "@/backend/infra"

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

