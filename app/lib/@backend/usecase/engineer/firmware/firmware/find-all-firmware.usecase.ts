import { IFirmwareRepository } from "@/app/lib/@backend/domain";
import { firmwareRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

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
