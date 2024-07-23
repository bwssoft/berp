import { singleton } from "@/app/lib/util/singleton"
import { IOpportunityRepository } from "@/app/lib/@backend/domain"
import { opportunityRepository } from "@/app/lib/@backend/repository/mongodb"

class FindAllOpportunityUsecase {
  repository: IOpportunityRepository

  constructor() {
    this.repository = opportunityRepository
  }

  async execute() {
    return await this.repository.findAll()
  }
}

export const findAllOpportunityUsecase = singleton(FindAllOpportunityUsecase)
