import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { firmwareRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";;

class FindOneFirmwareUsecase {
  repository: IFirmwareRepository;

  constructor() {
    this.repository = firmwareRepository;
  }

  @RemoveMongoId()
  async execute(args: Partial<IFirmware>) {
    return await this.repository.findOne(args);
  }
}

export const findOneFirmwareUsecase = singleton(FindOneFirmwareUsecase);

