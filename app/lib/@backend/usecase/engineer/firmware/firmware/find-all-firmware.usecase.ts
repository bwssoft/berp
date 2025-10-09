import { IFirmwareRepository } from "@/backend/domain/engineer/repository/firmware.repository";
import { firmwareRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";

class FindAllFirmwareUsecase {
  repository: IFirmwareRepository;

  constructor() {
    this.repository = firmwareRepository;
  }

  @RemoveMongoId()
  async execute() {
    const { docs } = await this.repository.findMany({});
    return docs
  }
}

export const findAllFirmwareUsecase = singleton(FindAllFirmwareUsecase);

