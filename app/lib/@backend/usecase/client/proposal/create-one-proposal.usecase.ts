import { singleton } from "@/app/lib/util/singleton"
import { IProposal, IProposalRepository } from "@/app/lib/@backend/domain"
import { proposalRepository } from "@/app/lib/@backend/repository/mongodb"
import { RemoveMongoId } from "../../../decorators"

class CreateOneProposalUsecase {
  repository: IProposalRepository

  constructor() {
    this.repository = proposalRepository
  }

  @RemoveMongoId()
  async execute(input: Omit<IProposal, "id" | "created_at" | "user_id">) {
    const proposal = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      user_id: "crypto.randomUUID()"
    })
    return await this.repository.create(proposal)
  }
}

export const createOneProposalUsecase = singleton(CreateOneProposalUsecase)
