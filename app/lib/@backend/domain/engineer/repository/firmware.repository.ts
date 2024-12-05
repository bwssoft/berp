import { IBaseRepository } from "../../@shared/repository/repository.interface";
import { IFirmware } from "../entity";

export interface IFirmwareRepository extends IBaseRepository<IFirmware> {
  findOneByName(name: string): Promise<IFirmware | null>
}