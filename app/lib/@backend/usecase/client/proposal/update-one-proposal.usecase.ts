import { singleton } from "@/app/lib/util/singleton"
import { IProposal, IProposalRepository } from "@/app/lib/@backend/domain"
import { proposalRepository } from "@/app/lib/@backend/repository/mongodb"

class UpdateOneProposalUsecase {
  repository: IProposalRepository

  constructor() {
    this.repository = proposalRepository
  }

  async execute(query: { id: string }, value: Omit<IProposal, "id" | "created_at" | "user_id">) {
    return await this.repository.updateOne(query, value)
  }
}

export const updateOneProposalUsecase = singleton(UpdateOneProposalUsecase)
