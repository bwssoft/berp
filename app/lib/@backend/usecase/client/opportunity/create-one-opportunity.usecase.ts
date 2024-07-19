import { singleton } from "@/app/lib/util/singleton"
import { IOpportunity, IOpportunityRepository } from "@/app/lib/@backend/domain"
import { opportunityRepository } from "@/app/lib/@backend/repository/mongodb"

class CreateOneOpportunityUsecase {
  repository: IOpportunityRepository

  constructor() {
    this.repository = opportunityRepository
  }

  async execute(input: Omit<IOpportunity, "id" | "created_at">) {
    const Opportunity = Object.assign(input, {
      created_at: new Date(),
      id: crypto.randomUUID()
    })
    return await this.repository.create(Opportunity)
  }
}

export const createOneOpportunityUsecase = singleton(CreateOneOpportunityUsecase)
