import { IOpportunityRepository } from "@/app/lib/@backend/domain";
import { opportunityRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllOpportunityUsecase {
  repository: IOpportunityRepository;

  constructor() {
    this.repository = opportunityRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllOpportunityUsecase = singleton(FindAllOpportunityUsecase);
