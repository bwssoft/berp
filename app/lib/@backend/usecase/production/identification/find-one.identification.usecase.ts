import {
  IIdentification,
  IIdentificationRepository,
} from "@/app/lib/@backend/domain";
import { identificationRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindOneIdentificationUsecase {
  repository: IIdentificationRepository;

  constructor() {
    this.repository = identificationRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<IIdentification>) {
    const result = await this.repository.findOne(input);
    return result;
  }
}

export const findOneIdentificationUsecase = singleton(
  FindOneIdentificationUsecase
);
