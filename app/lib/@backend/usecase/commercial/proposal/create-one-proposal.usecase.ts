import { singleton } from "@/app/lib/util/singleton"
import { IProposal, IProposalRepository } from "@/app/lib/@backend/domain"
import { proposalRepository } from "@/app/lib/@backend/infra"
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class CreateOneProposalUsecase {
  repository: IProposalRepository

  constructor() {
    this.repository = proposalRepository
  }

  @RemoveMongoId()
  async execute(input: Omit<IProposal, "id" | "created_at" | "code" | "user_id">) {
    const last_proposal = await this.repository.findOne({}, { sort: { code: -1 }, limit: 1 })

    const proposal = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      code: (last_proposal?.code ?? 0) + 1
    })
    return await this.repository.create(proposal)
  }
}

export const createOneProposalUsecase = singleton(CreateOneProposalUsecase)
