import { INegotiationTypeRepository } from "@/app/lib/@backend/domain";
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
    return await this.repository.findAll({});
  }
}

export const findAllNegotiationTypeUsecase = singleton(
  FindAllNegotiationTypeUsecase
);
