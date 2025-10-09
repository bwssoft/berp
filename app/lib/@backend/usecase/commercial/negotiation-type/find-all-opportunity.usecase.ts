import { INegotiationTypeRepository } from "@/app/lib/@backend/domain/commercial/repository/negotiation-type.repository";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { negotiationTypeRepository } from "@/app/lib/@backend/infra";

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
