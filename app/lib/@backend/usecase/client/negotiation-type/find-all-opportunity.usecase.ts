import { INegotiationTypeRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";
import { negotiationTypeRepository } from "../../../repository/mongodb/client/negotiation-type.repository";

class FindAllNegotiationTypeUsecase {
  repository: INegotiationTypeRepository;

  constructor() {
    this.repository = negotiationTypeRepository;
  }

  @RemoveMongoId()
  async execute() {
    return await this.repository.findAll();
  }
}

export const findAllNegotiationTypeUsecase = singleton(FindAllNegotiationTypeUsecase);
