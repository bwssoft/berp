import { singleton } from "@/app/lib/util/singleton"
import { IOpportunity, IOpportunityRepository } from "@/app/lib/@backend/domain"
import { opportunityRepository } from "@/app/lib/@backend/infra"

class DeleteOneOpportunityUsecase {
  repository: IOpportunityRepository

  constructor() {
    this.repository = opportunityRepository
  }

  async execute(input: Partial<IOpportunity>) {
    return await this.repository.deleteOne(input)
  }
}

export const deleteOneOpportunityUsecase = singleton(DeleteOneOpportunityUsecase)
