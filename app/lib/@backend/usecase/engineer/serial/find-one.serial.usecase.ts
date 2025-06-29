import { ISerial, ISerialRepository } from "@/app/lib/@backend/domain";
import { serialRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class FindOneSerialUsecase {
  repository: ISerialRepository;

  constructor() {
    this.repository = serialRepository;
  }

  @RemoveMongoId()
  async execute(input: Partial<ISerial>) {
    const result = await this.repository.findOne(input);
    return result;
  }
}

export const findOneSerialUsecase = singleton(FindOneSerialUsecase);
