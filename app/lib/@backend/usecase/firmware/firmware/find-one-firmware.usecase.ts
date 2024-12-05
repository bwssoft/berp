import { IFirmware, IFirmwareRepository } from "@/app/lib/@backend/domain";
import { firmwareRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "../../../decorators";

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
