import { singleton } from "@/app/lib/util/singleton"
import { IOpportunity, IOpportunityRepository } from "@/app/lib/@backend/domain"
import { opportunityRepository } from "@/app/lib/@backend/infra"

class UpdateOneOpportunityUsecase {
  repository: IOpportunityRepository

  constructor() {
    this.repository = opportunityRepository
  }

  async execute(query: { id: string }, value: Omit<IOpportunity, "id" | "created_at">) {
    return await this.repository.updateOne(query, { $set: value })
  }
}

export const updateOneOpportunityUsecase = singleton(UpdateOneOpportunityUsecase)
