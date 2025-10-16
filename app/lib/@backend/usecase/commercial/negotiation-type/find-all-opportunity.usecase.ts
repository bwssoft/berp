import { INegotiationTypeRepository } from "@/backend/domain/commercial/repository/negotiation-type.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { negotiationTypeRepository } from "@/backend/infra";

class FindAllNegotiationTypeUsecase {
  repository: INegotiationTypeRepository;

  constructor() {
    this.repository = negotiationTypeRepository;
  }

  @RemoveMongoId()
  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs
  }
}

export const findAllNegotiationTypeUsecase = singleton(
  FindAllNegotiationTypeUsecase
);

