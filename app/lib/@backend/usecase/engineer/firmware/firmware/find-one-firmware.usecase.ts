import { IFirmware } from "@/app/lib/@backend/domain/engineer/entity/firmware.definition";
import { IFirmwareRepository } from "@/app/lib/@backend/domain/engineer/repository/firmware.repository.interface";
import { firmwareRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";;

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
