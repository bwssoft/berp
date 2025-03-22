import {
  IDeviceIdentificationLog,
  IDeviceIdentificationLogRepository,
} from "@/app/lib/@backend/domain";
import { deviceIdentificationLogRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

namespace Dto {
  export interface Input extends Partial<IDeviceIdentificationLog> {}

  export type Output = IDeviceIdentificationLog | null;
}

class FindOneDeviceIdentificationLogUsecase {
  repository: IDeviceIdentificationLogRepository;

  constructor() {
    this.repository = deviceIdentificationLogRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    const result = await this.repository.findOne(arg);
    return result;
  }
}

export const findOneDeviceIdentificationLogUsecase = singleton(
  FindOneDeviceIdentificationLogUsecase
);
