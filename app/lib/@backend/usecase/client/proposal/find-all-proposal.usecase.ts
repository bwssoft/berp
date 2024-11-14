import { IProposalRepository } from "@/app/lib/@backend/domain";
import { proposalRepository } from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

class FindAllProposalUsecase {
  repository: IProposalRepository;

  constructor() {
    this.repository = proposalRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllProposalUsecase = singleton(FindAllProposalUsecase);
