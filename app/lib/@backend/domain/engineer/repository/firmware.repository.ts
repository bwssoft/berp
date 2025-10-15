import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IFirmware } from "@/backend/domain/engineer/entity/firmware.definition";

export interface IFirmwareRepository extends IBaseRepository<IFirmware> {
  findOneByName(name: string): Promise<IFirmware | null>
}
