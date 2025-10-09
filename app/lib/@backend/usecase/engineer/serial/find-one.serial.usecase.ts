import { ISerial } from "@/backend/domain/engineer/entity/serial.definition";
import { ISerialRepository } from "@/backend/domain/engineer/repository/serial.repository";
import { serialRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

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

