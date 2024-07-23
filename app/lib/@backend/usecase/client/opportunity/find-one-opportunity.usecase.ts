import { singleton } from "@/app/lib/util/singleton"
import { IOpportunity, IOpportunityRepository } from "@/app/lib/@backend/domain"
import { opportunityRepository } from "@/app/lib/@backend/repository/mongodb"

class FindOneOpportunityUsecase {
  repository: IOpportunityRepository

  constructor() {
    this.repository = opportunityRepository
  }

  async execute(input: Partial<IOpportunity>) {
    return await this.repository.findOne(input)
  }
}

export const findOneOpportunityUsecase = singleton(FindOneOpportunityUsecase)
